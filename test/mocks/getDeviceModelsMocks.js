
const success = {
  mock: {
    ok: true,
    status: 200,
    data: {
      result: [
        {
          model: '10.2 INCH IPAD WI-FI CELLULAR 128GB SPACE GREY',
          colourName: null,
          colourCode: null,
          size: null,
          deviceId: null,
          stockavailable: false,
          cashPrice: null,
          priceFrom: null,
          priceMax: null,
          availableQuantity: null,
          stockExpectedDate: null,
          baseDeviceId: null,
          seoUrl: null,
          priorityOverall: null,
          imageSourceTiny: null,
          imageSourceSmall: null,
          imageSourceMedium: null,
          imageSourceLarge: null,
          imageSourceHuge: null,
          line500Code: '108017436',
          insuranceCode: null,
          onlineChannel: null,
          deviceTypeName: null,
          manufacturer: 'Apple',
          cvmcampaignid: null,
          deviceGroupName: null,
          links: []
        },
        {
          model: '10.2 INCH IPAD WI-FI CELLULAR 32GB SPACE GREY',
          colourName: null,
          colourCode: null,
          size: null,
          deviceId: null,
          stockavailable: false,
          cashPrice: null,
          priceFrom: null,
          priceMax: null,
          availableQuantity: null,
          stockExpectedDate: null,
          baseDeviceId: null,
          seoUrl: null,
          priorityOverall: null,
          imageSourceTiny: null,
          imageSourceSmall: null,
          imageSourceMedium: null,
          imageSourceLarge: null,
          imageSourceHuge: null,
          line500Code: '108017436',
          insuranceCode: null,
          onlineChannel: null,
          deviceTypeName: null,
          manufacturer: 'Apple',
          cvmcampaignid: null,
          deviceGroupName: null,
          links: []
        }
      ]
    }
  }
};

const expected = {
  data: {
    "brand": "Apple",
    "description": "model name of devices",
    "productSpecCharacteristic": [
        {
            "name": "model",
            "valueType": "string",
            "productSpecCharacteristicValue": {
                "value": "10.2 INCH IPAD WI-FI CELLULAR 128GB SPACE GREY"
            }
        },
        {
          "name": "model",
          "valueType": "string",
          "productSpecCharacteristicValue": {
              "value": "10.2 INCH IPAD WI-FI CELLULAR 32GB SPACE GREY"
          }
      }
    ]
  }
};

const failure = {
  mock: {
    ok: false,
    error: {
      response: {
        status: 404,
        statusText: 'Not Found',
        data:{
          messages:[
            {
              message: "No devices found for channel"
            }
          ]
        }
      }
    }
  },
  expected: {
    result: {
        "code": 404,
        "status": "Not Found",
        "message": "No devices found for channel"
    }
  }
};

module.exports = {
  success,
  failure,
  expected
};
