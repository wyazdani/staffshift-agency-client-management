import {promise} from '../src/http_server';
// eslint-disable-next-line no-console
console.log('after importing the server promise');
export async function mochaGlobalSetup() {
  // eslint-disable-next-line no-console
  console.log('Waiting for http server to run');
  await promise();
  // eslint-disable-next-line no-console
  console.log('http server running');
}
