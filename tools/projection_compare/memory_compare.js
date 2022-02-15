'use strict';
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const _ = require('lodash');
const comparisonFields = {
  'source': ['agency_id', 'name', 'description', 'max_consultants', 'status'],
  'destination': ['agency_id', 'name', 'description', 'max_consultants', 'status'],
}

const run = async () => {
  console.log('Comparison script started');
  const client = await MongoClient.connect(config.mongo.connection, { useUnifiedTopology: true });
  const db = client.db(config.mongo.database);
  const SourceCollection = db.collection(config.mongo.source_collection);
  const DestinationCollection = db.collection(config.mongo.destination_collection);
  const sourceData = await SourceCollection.find({}).toArray();
  console.log(`Source data retrieved from collection: ${config.mongo.source_collection}`);
  const destinationData = await DestinationCollection.find({}).toArray();
  console.log(`Destination data retrieved from collection: ${config.mongo.destination_collection}`);

  if (sourceData.length !== destinationData.length) {
    console.error(`Source length: ${sourceData.length} and Destination length: ${destinationData.length} do not match`);
  }

  let counter = 0;
  for (const item of sourceData) {
    counter++;
    // TODO improve find to remove need to always alter the code.
    const destItem =  _.find(destinationData, {_id: item._id});
    if (!destItem) {
      console.error('DESTINATION MISSING DOCUMENT', item);
    }
    await compare(item, destItem);
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
    console.error('PROJECTION COMPARISON FAILED', source, destination);
  }
}

run().then(
  () => {
    console.log('COMPELTED');
  }
).catch((err) => {
  console.error('ERROR', err);
});