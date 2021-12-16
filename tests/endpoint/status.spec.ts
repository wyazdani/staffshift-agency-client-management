import {api} from '../tools/TestUtilsApi';

describe('/status', () => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': '123'
  };

  describe('get', () => {
    it('should respond with 200', async () => {
      const res = await api.get('/status').set(headers).send();

      res.statusCode.should.equal(200);
    });
  });
});
