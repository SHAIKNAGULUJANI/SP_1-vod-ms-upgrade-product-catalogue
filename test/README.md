Put all test cases for the controllers/services here.

All upstream calls should be stubbed and mocked so that no actual network call is made during test execution.

Chai (test suite) documentation: https://www.chaijs.com/api/
Sinon (stubbing framework) documentation: https://sinonjs.org/releases/v7.2.3/

Test case template structure:
```javascript
  import 'chai/register-should';
  import chai from 'chai';
  import { getServiceLogger } from '../../src/helpers/logger';
  import httpStatus from 'http-status-codes';
  import httpMocks from 'node-mocks-http';
  import sinon from 'sinon';
  import sinonChai from 'sinon-chai';

  //import controller/service to be mocked
  //import controller/service to be tested
  //import mocks

  chai.use(sinonChai);

  const expect = chai.expect;

  function next() {
    return true;
  }

  let logger, req, res; // Define additional stubs here

  describe('', function () { // Add test suite description

    before(() => {
      logger = getServiceLogger(process.pid);

      //Stub all necessary functions so that the code you are trying to test is being tested in isolation.
    });

    beforeEach(() => {
      // Reset call history and behaviour of stub so previously run tests don't affect subsequent tests.
      // stubName.reset();

      //Generate new request and response objects
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();

      // Attach logger to request
      req.log = logger;

      // Add any parameters/headers your controller is expecting to receive.
      req.headers = {
        authorization: 'Bearer myAccessToken'
      };

      // Simulate the successful execution of vod-npm-auth
      req.user = {
        contextMsisdn: '27821234567'
      };

      req.user.jwt = {
        user_name: 'ZA'
      };
    });

    afterEach(() => {
      req = null;
      res = null;
    });

    after(() => {
      // Restore all stubs so that their proper behaviour is restored for other tests.
      // stubName.restore();
    });

    it('', async () => { // Add description of test case
      /*
        stubName.returns(mock);
        or
        stubName.throws(relevant error);
      *//

      try {

        // Call code to be tested
        // Use expect api to assert results are as expected
      } catch (err) {
        req.log.error(err); // Log error so you can figure out what happened if test case fails
        err.should.not.exist(); // Fail test case due to unxpected error. If you actually expected the error to happen then use expect to assert it's the correct error.
      }
    });
  });
```