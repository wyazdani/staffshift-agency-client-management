'use strict';

const config = require('config');
const allowEnvs = ['beta', 'ci', 'development', 'production', 'sandbox', 'testing', 'staging'];

if (allowEnvs.indexOf(process.env.NODE_ENV) === -1) {
  throw new Error('A valid environment needs to be specified');
}

module.exports = {
  mongoUri: config.get('mongo.database_host'),
  migrationCollection: 'migrations'
};

