import sinon from 'sinon';

export const mochaHooks = {
  beforeAll: (done: () => void) => {
    // eslint-disable-next-line no-console
    console.log('Waiting for http server to run');
    /*eslint-disable*/
    const {startServer} = require('../src/http_server');

    /*eslint-enable*/
    startServer.then(done);
  },
  afterEach: (): void => {
    sinon.restore();
  }
};
