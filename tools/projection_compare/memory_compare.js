'use strict';
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const _ = require('lodash');
const comparisonFields = {
  'source': ['linked', 'client_type', "created_at"],
  'destination': ['linked', 'client_type'],
}

const run = async () => {
  const client = await MongoClient.connect(config.mongo.connection, { useUnifiedTopology: true });
  const db = client.db(config.mongo.database);
  const SourceCollection = db.collection(config.mongo.source_collection);
  const DestinationCollection = db.collection(config.mongo.destination_collection);
  const sourceData = await SourceCollection.find({}).toArray();
  console.log('Source data retrieved');
  const destinationData = await DestinationCollection.find({}).toArray();
  console.log('Destination data retrieved');

  let counter = 0;
  for (const item of sourceData) {
    counter++;
    const destItem =  _.find(destinationData, {agency_id: item.agency_id, client_id: item.client_id});
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