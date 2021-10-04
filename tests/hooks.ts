import sinon from 'sinon';
import {promise} from '../src/http_server';
export const mochaHooks = {
  before: function before(done: () => void) {
    // TODO see if this helps with random failing test cases
    this.timeout(35000);
    // eslint-disable-next-line no-console
    console.log('Waiting for http server to run');
    promise.then(done);
  },
  afterEach: (): void => {
    sinon.restore();
  }
};
