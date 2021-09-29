import sinon from 'sinon';
import {promise} from '../src/http_server';
export const mochaHooks = {
  before: (done: () => void) => {
    // eslint-disable-next-line no-console
    console.log('Waiting for http server to run');
    promise.then(done);
  },
  afterEach: (): void => {
    sinon.restore();
  }
};
