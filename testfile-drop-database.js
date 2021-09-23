'use strict';
const config = require('config');
const mongoose = require('mongoose');
const env = process.env.NODE_ENV;

(async () => {
  try {
    if (env === 'testing') {
      await mongoose.connect(config.mongo.database_host, config.mongo.options);
      await mongoose.connection.db.dropDatabase(mongoose.connection.db);
      await mongoose.connection.close();
    } else {
      console.info('Not dropping database env: ', env);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error in drop database', error);
    process.exit(1);
  }
})();
