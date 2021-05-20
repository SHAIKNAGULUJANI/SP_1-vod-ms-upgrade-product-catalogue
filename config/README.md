Use the pre-defined config files to add various configuration details to your project based on the environment it is running in.

devcluster.yaml corresponds to the dev and qa clusters

prodcluster.yaml corresponds to the  staging and prod clusters

development.yaml corresponds to development done on local machine. Development config usually points to QA.

Config files are merged onto each other. Default.yaml will always be loaded first, followed by the relevant cluster config, and finally custom environment variables.

Only define config values in devcluster/prodcluster if they specifically need to be overwritten in those specific environments. If staging and qa can both use the same value, then define it in default.yaml instead.

An example of configurations that may be added to, for instance, the `/config/default.yaml` file are the URI configurations for the upstream client calls. We could add the yaml data as per the example below:
```yaml
vod-ms-example:
  uri: http://vod-ms-example:8080
  exampleEndpointOnePostfix: /public-services/v1/some/awesome/endpoint/{with}/{path}/{params}
  exampleEndpointTwoPostfix: /public-services/v1/some/other/awesome/endpoint
```

The above config can then be accessed on the client via the `config` module as per the below example:
```javascript
const config = require('config');

const base = config.get('vod-ms-example.uri'); // http://vod-ms-example:8080

// http://vod-ms-example:8080/public-services/v1/some/awesome/endpoint/{with}/{path}/{params}
const exampleEndpointOneURI = base + config.get('vod-ms-example.exampleEndpointOnePostfix');

// http://vod-ms-example:8080/public-services/v1/some/other/awesome/endpoint
const exampleEndpointTwoURI = base + config.get('vod-ms-example.exampleEndpointTwoPostfix');
```

Once the URIs are fetched from config and built, the requests could be made using our wrapped axios instance (further elaboration on the wrapped instance in `/src/clients/README.md`) as per the below example:
```javascript
const { getWrappedAxios } = require('../helpers/zipkinHelper');
const zipkinAxios = getWrappedAxios('vod-ms-example');

zipkinAxios.get(exampleEndpointOneURI, {
  pathParams: { 
    with: 'hello', 
    path: 'superCool', 
    params: 'endpoint'
  }
})
  .then(console.log) // Implement proper resolve handler.
  .catch(console.err) // Implement proper error handler.
```