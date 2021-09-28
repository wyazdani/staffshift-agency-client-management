import {promise} from '../src/http_server';
export const mochaHooks = {
  before: (done: () => void) => {
    // eslint-disable-next-line no-console
    console.log('------------------------------PROMISE');
    promise.then(done);
  }
};
