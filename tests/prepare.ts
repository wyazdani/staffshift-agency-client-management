import chai from 'chai';
import {env} from 'process';
const allowedEnvs = ['testing', 'ci'];

if (!allowedEnvs.includes(env.NODE_ENV)) {
  console.error('not allowed ENV', env.NODE_ENV);
  process.exit(1);
}

chai.should();

// configure other requirements
