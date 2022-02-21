'use strict';
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const _ = require('lodash');
const comparisonFields = {
  'AgencyConsultantRolesProjection': {
    'source': ['agency_id', 'name', 'description', 'max_consultants', 'status'],
    'destination': ['agency_id', 'name', 'description', 'max_consultants', 'status']
  },
  'AgencyClientsProjection': {
    'source': ['linked', 'client_type'],
    'destination': ['linked', 'client_type']
  },
  'AgencyClientConsultantsProjection': {
    'source': ['consultant_role_id', 'consultant_role_name', 'consultant_name'],
    'destination': ['consultant_role_id', 'consultant_role_name', 'consultant_name']
  }
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
    const destItem =  _.find(
      destinationData,
      {agency_id: item.agency_id, client_id:item.client_id,
        consultant_id: item.consultant_id, consultant_role_id: item.consultant_role_id}
    );
    if (!destItem) {
      console.error('DESTINATION MISSING DOCUMENT', item);
    }
    await compare(config.mongo.source_collection, item, destItem);
    if (counter % 100 === 0) {
      console.log(`PROGRESS: completed ${counter}`);
    }
  }
}

const compare = async (key, source, destination) => {
  if (
    !_.isEqual(
      _.pick(source, comparisonFields[key].source),
      _.pick(destination, comparisonFields[key].destination)
    )
  ) {
    console.error('PROJECTION COMPARISON FAILED', source, destination);
  }
}

run().then(
  () => {
    console.log('COMPLETED');
  }
).catch((err) => {
  console.error('ERROR', err);
});