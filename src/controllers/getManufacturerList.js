const config = require("config");
const { Sentry } = require("vod-npm-sentry");
const sentryCategory = config.get("sentry.categories.getManufacturerList");
const { upgradesService } = require("vod-npm-services");
const client = require("restify-prom-bundle").client;
const getManufacturerListError = new client.Counter({
  name: "counter_get_manufacturer_list_error",
  help: "vod-ms-upgrades config map call error",
});

exports.handler = async function getManufacturerList(req, res, next) {
  Sentry.info("Beginning getManufacturerList...", {}, sentryCategory);

  const params = {
    headers: req.headers,
  };

  const response = await upgradesService.getConfig(req, params);

  if (!response.ok) {
    getManufacturerListError.inc();
    return next(response.error);
  }

    const jsonData = response.data.result.properties.brandName
    let manufacturersArr = jsonData.map(getManufacturerDetails);
    function getManufacturerDetails(model) {
      let modelDetails = {
        name: model,
      };
      return modelDetails;
    }

    res.status(response.status);
    res.json({
      description: "brandName of devices",
      name: "devicebrandName",
      subCategory: manufacturersArr,
    });
    return next();
};