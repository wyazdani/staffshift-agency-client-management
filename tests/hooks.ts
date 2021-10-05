import sinon from 'sinon';
import {startServer} from '../src/http_server';

export const mochaHooks = {
  beforeAll: (done: () => void) => {
    // eslint-disable-next-line no-console
    console.log('Waiting for http server to run');
    startServer.then(done);
  },
  afterEach: (): void => {
    sinon.restore();
  }
};
