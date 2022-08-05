'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');
const collectionName = 'AgencyClientFinancialHoldsProjectionV1';
const indexDetails = {
  agency_id: 1,
  client_id: 1
};
const indexOptions = {
  background: true,
  unique: true
};
module.exports = {
  id: '0028-create-index-AgencyClientFinancialHoldsProjectionV1-agencyclient-index',
  up: (db, cb) => {
    ensureIndexExists(
      db.collection(collectionName),
      indexDetails,
      indexOptions
    ).then(() => {
      cb();
    }).catch((err) => {
      cb(err);
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