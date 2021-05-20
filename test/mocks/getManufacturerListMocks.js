
const success = {
  mock: {
    ok: true,
    status: 200,
    data: {
      result: {
        properties: {
          deviceType: [
            'Smartphones',
            'Tablets',
            'Accessory',
            'Routers / Modems / Laptops',
            'Lifestyle'
          ],
          brandName: [
            'Apple',
            'Samsung',
            'Huawei',
            'Lenovo',
            'Sony Ericsson',
            'ZTE',
            'Xiaomi',
            'Sony',
            'Nokia',
            'LG',
            'Hisense'
          ],
          ebuUrl: 'https://www.vodacombusiness.co.za/business/deals/devices',
          gridviewUrl: '/cloud/shopping/devices',
          orderconfirmationUrl: '/cloud/shopping/order-summary?salesChannel=Upgrade',
          redirectTimeout: 2000,
          legacyAllowed: false
        }
      }
    }
  }
};

const expected = {
  data: {
    description: "brandName of devices",
    name: "devicebrandName",
    subCategory: [
      {
        name: "Apple",
      },
      {
        name: "Samsung",
      },
      {
        name: "Huawei",
      },
      {
        name: "Lenovo",
      },
      {
        name: "Sony Ericsson",
      },
      {
        name: "ZTE",
      },
      {
        name: "Xiaomi",
      },
      {
        name: "Sony",
      },
      {
        name: "Nokia",
      },
      {
        name: "LG",
      },
      {
        name: "Hisense",
      },
    ],
  },
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
    "code": 404,
    "status": "Not Found",
    "message": "No devices found for channel"
  }
};

module.exports = {
  success,
  failure,
  expected
};
