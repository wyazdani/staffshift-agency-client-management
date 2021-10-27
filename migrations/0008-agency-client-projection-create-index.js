'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');
const collectionName = 'AgencyClientsProjection';
const indexDetails = {
  'agency_id': 1,
  'client_id': 1
};
const indexOptions = {
  background: true
};
module.exports = {
  id: '0008-agency-client-projection-create-index',
  up: (db, cb) => {
    db.createCollection(collectionName, {collation: {locale: 'en_US', strength: 2}}, (err) => {
      //if collection already exists, it does not throw error
      if (err) {
        return cb(err);
      }
      ensureIndexExists(
        db.collection(collectionName),
        indexDetails,
        indexOptions
      ).then(() => {
        cb();
      }).catch((err) => {
        cb(err);
      });
    });

  },

  down: (db, cb) => {
    ensureIndexRemoved(
      db.collection(collectionName),
      indexDetails,
      indexOptions
    ).then(() => {
      cb();
    }).catch((err) => {
      cb(err);
    });
  }
};