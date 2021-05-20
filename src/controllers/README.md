
Controllers for handling request and response logic.

Your controllers serve as the entryway for your endpoints.

Controllers should only be concerned with the handling of requests and generating responses.

Example controller:
```javascript
const config = require('config');
const { exampleService } = require('vod-npm-services');
const httpStatus = require('http-status-codes');
const { Sentry } = require('vod-npm-sentry');

// Blank line after imports - then 'global' variables
const SENTRY_CATEGORY = config.get('sentry.categories.exampleCategory');

exports.handler = async function exampleController(req, res, next) {

  const params = {
    //Extract params
  };

  const response = await exampleService.exampleFunction(req, params);

  if (!response.ok) {
    return next(response.error); //Invokes the error middleware
  }

  res.status(httpStatus.OK);
  res.json({
    result: response.data
  });

  return next();
};
```
