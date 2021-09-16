import config from 'config';
import mongoose from 'mongoose';
const env = process.env.NODE_ENV;
const {database_host: databaseHost, options} = config.get('mongo');
(async () => {
  try {
    if (env === 'testing') {
      await mongoose.connect(databaseHost, options);
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    } else {
      console.log('Not dropping database env: ', env);
    }
    process.exit(0);
  } catch (error) {
    console.log('Error in drop database', error);
    process.exit(1);
  }
})();