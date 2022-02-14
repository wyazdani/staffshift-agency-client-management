'use strict';
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const _ = require('lodash');
const selectorFields = ['agency_id', 'client_id'];
const comparisonFields = {
  'source': ['linked', 'client_type'],
  'destination': ['linked', 'client_type'],
}

const run = async () => {
  const client = await MongoClient.connect(config.mongo.connection, { useUnifiedTopology: true });
  const db = client.db(config.mongo.database);
  const SourceCollection = db.collection(config.mongo.source_collection);
  const DestinationCollection = db.collection(config.mongo.destination_collection);
  const cursor = await SourceCollection.find({});

  let counter = 0;
  while (await cursor.hasNext()) {
    counter++;
    const source = await cursor.next();
    const destination = await DestinationCollection.findOne(_.pick(source, selectorFields));
    await compare(source, destination);
    if (counter % 100 === 0) {
      console.log(`PROGRESS: completed ${counter}`);
    }
  }
}

const compare = async (source, destination) => {
  if (
    !_.isEqual(
      _.pick(source, comparisonFields.source),
      _.pick(destination, comparisonFields.destination)
    )
  ) {
    console.error('PROJECTION COMPARISON FAILED',source, destination);
  }
}

run().then(
  () => {
    console.log('COMPELTED');
  }
).catch((err) => {
  console.error('ERROR', err);
});