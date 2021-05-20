const config = require('config');
const httpStatus = require('http-status-codes');
const restify = require('restify');
const promBundle = require('restify-prom-bundle');
const fs = require('fs');
const swaggerRoutes = require('swagger-routes');
const SwaggerRestify = require('swagger-restify-mw');
const CookieParser = require('restify-cookies');
const neoAsync = require('neo-async');
const yaml = require('js-yaml');
const restifySanitize = require('vod-npm-restify-sanitize')();
const promClient = require('restify-prom-bundle').client;
const { getContext, getTracer } = require('vod-npm-utils/zipkin');
const { createLogger, traceIdMiddleware } = require('vod-npm-console-logger');
const { Sentry } = require('vod-npm-sentry');
const { restifyErrorMiddleware } = require('vod-npm-utils/error');

const LOGGER = createLogger({
  name: 'vod-ms-journey-upgrade-product-catalogue',
  level: config.get('log.level')
});

Sentry.init(LOGGER);

let swaggerYamlFile;

try {
  swaggerYamlFile = yaml.safeLoad(fs.readFileSync('./src/swagger/swagger.yaml', 'utf8'));
  Object
    .keys(swaggerYamlFile.paths)
    .filter((key) => !key.includes('swagger')).forEach((pathName) => {
      if (config.has('swagger.basePath') && config.get('swagger.basePath') !== '/') {
        const baseWithPathName = `${config.get('swagger.basePath')}${pathName}`;
        const copyOfPath = swaggerYamlFile.paths[pathName];

        swaggerYamlFile.paths[baseWithPathName] = copyOfPath;
        delete swaggerYamlFile.paths[pathName];
      }
    });
} catch (e) {
  LOGGER.warn(e);
}

const AggregatorRegistry = promClient.AggregatorRegistry;
const aggregatorRegistry = new AggregatorRegistry();

const app = restify.createServer({
  log: LOGGER
});

// Request handler has to be the first middleware, so register it immediately.
app.use(Sentry.Handlers.requestHandler());

app.get('/manage/prometheus', (req, res) => {

  aggregatorRegistry.clusterMetrics((err, metrics) => {

    if (err) {
      LOGGER.error(err);
    }

    res.set('Content-Type', aggregatorRegistry.contentType);
    res.send(metrics);
  });
});

app.get('/manage/health', (req, res) => {
  res.send(httpStatus.OK);
});

app.pre(promBundle.preMiddleware(app, {
  route: '/manage/prometheus',
  promDefaultDelay: 7000,
  maxPathsToCount: 100
}));

const ZIPKIN_ENABLED = config.get('zipkin.enabled') || false;

const SERVER_PORT = 8080;

const swaggerConfig = {
  appRoot: __dirname, // required config
  env: process.env,
  swagger: swaggerYamlFile
};

/* Helper function that parallelizes most of the required Restify Middleware */
function parallelize(middlewares) {
  return function (req, res, next) {
    neoAsync.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
}

app.use(restify.plugins.bodyParser());
app.use(restify.plugins.conditionalRequest());

const parallelMiddleware = [
  restify.plugins.acceptParser(app.acceptable),
  restify.plugins.authorizationParser(),
  restify.plugins.dateParser(),
  restify.plugins.queryParser(),
  restify.plugins.jsonp(),
  restify.plugins.requestLogger(),
  restify.plugins.fullResponse(),
  CookieParser.parse
];

if (ZIPKIN_ENABLED) {
  const zipkinMiddleware = require('zipkin-instrumentation-restify').restifyMiddleware;

  const tracer = getTracer();

  app.use(zipkinMiddleware({ tracer }));
  app.use(function (_req, res, next) {
    const ctx = getContext();

    if (ctx) {
      res.setHeader('X-B3-TraceId', ctx.traceId);
    }
    return next();
  });
  app.use(traceIdMiddleware(tracer));
}

app.use(parallelize(parallelMiddleware));
app.use(restifySanitize.sanitize);

// This maps the controllers to the swagger document
swaggerRoutes(app, {
  api: './src/swagger/swagger.yaml',
  handlers: function (operation) {
    return {
      middleware: function (req, _res, next) {
        Sentry.setupRequestContext(req);
        return next();
      },
      handler: require(`./src/controllers/${operation.id}.js`).handler
    };
  }
});

SwaggerRestify.create(swaggerConfig, function (err, swaggerRestify) {

  if (err) {
    throw err;
  }

  swaggerRestify.register(app);
  app.use(Sentry.Handlers.errorHandler());
  app.listen(swaggerConfig.env.PORT || SERVER_PORT);
});

app.on('restifyError', restifyErrorMiddleware());