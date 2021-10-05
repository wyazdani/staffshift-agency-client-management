import {startServer} from '../src/http_server';

export async function mochaGlobalSetup() {
  // eslint-disable-next-line no-console
  console.log('Waiting for http server to run');
  await startServer;
}
