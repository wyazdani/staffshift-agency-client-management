'use strict';
const {MongoClient} = require('mongodb');
const config = require('config');
const mongoose = require('mongoose');
const Logger = require('a24-logzio-winston');

const AgencyClientConsultantProjection =  require('./src/ReadProjections/AgencyClientConsultantProjection');
const AgencyClientEventLogProjection =  require('./src/ReadProjections/AgencyClientEventLogProjection');
const AgencyClientProjection =  require('./src/ReadProjections/AgencyClientProjection');

const EventStoreTransformer =  require('./src/ReadProjections/EventStoreTransformer');

// Setup logger
Logger.setup(config.get('logger'));
let loggerContext = Logger.getContext('Event Store Watcher');

// Setup mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error) {
    loggerContext.crit('MongoDB connection error', error);
    process.exit(1);
  }
);

async function watch() {
  const client = new MongoClient(config.get(`mongo.database_host`), {poolSize: 5});
  // Connect the client to the server
  await client.connect();
  // Establish and verify connection
  await client.db().command({ping: 1});
  const db = client.db();
  const watchStream = db.collection('EventStore').watch({});

  const eventStoreTransformer = new EventStoreTransformer();

  // Do we have 1 pipe or many pipes?
  // This approach means that each "step" could be applied more than once if the subsequent steps fail.
  // const clientConsultantProjection = new AgencyClientConsultantProjection();
  // const agencyClientEventLogProjection = new AgencyClientEventLogProjection();
  const projection = new AgencyClientProjection();
  watchStream
    .pipe(eventStoreTransformer)
    .pipe(projection);
}


watch()
  .then(() => {
    loggerContext.info('Watcher process has been initialised');
  })
  .catch((err) => {
    loggerContext.error('There was an error while watching the event store', err);
    process.exit(1);
  })