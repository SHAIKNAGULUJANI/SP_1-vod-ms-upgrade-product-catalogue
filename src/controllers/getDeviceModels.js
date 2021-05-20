const config = require("config");
const { Sentry } = require("vod-npm-sentry");
const sentryCategory = config.get("sentry.categories.getDeviceModels");
const { devicesService } = require("vod-npm-services");
const client = require("restify-prom-bundle").client;
const getDeviceModelsError = new client.Counter({
  name: "counter_get_device_models_error",
  help: "vod-ms-devices client call error",
});

exports.handler = async function getDeviceModels(req, res, next) {
  Sentry.info("Beginning getDeviceModels...", {}, sentryCategory);
  const params = {
    headers: req.headers,
    manufacturer: req.query.brandName,
  };

  let response = await devicesService.getDeviceModels(req, params);
  if (!response.ok) {
    getDeviceModelsError.inc();
    return next(response.error);
  }

  const jsonData = response.data.result;
  let brand = response.data.result[0].manufacturer;
  let myArr = jsonData.map(getModelsDetails);

  function getModelsDetails(model) {
    let modelDetails = {
      name: "model",
      valueType: "string",
      productSpecCharacteristicValue: {
        value: model.model,
      },
    };
    return modelDetails;
  }

  res.status(response.status);
  res.json({
    brand: brand,
    description: "model name of devices",
    productSpecCharacteristic: myArr,
  });
  return next();
};
