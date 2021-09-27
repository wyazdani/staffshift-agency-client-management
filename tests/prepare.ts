import {env} from 'process';
import {should, use} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const allowedEnvs = ['testing', 'ci'];

if (!allowedEnvs.includes(env.NODE_ENV)) {
  // eslint-disable-next-line no-console
  console.error('not allowed ENV', env.NODE_ENV);
  process.exit(1);
}

use(chaiAsPromised);
use(sinonChai);
should();

// configure other requirements
