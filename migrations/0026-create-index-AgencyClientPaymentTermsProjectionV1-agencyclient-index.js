'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');
const collectionName = 'AgencyClientPaymentTermsProjectionV1';
const indexDetails = {
  agency_id: 1,
  client_id: 1
};
const indexOptions = {
  background: true,
  unique: true
};
module.exports = {
  id: '0026-create-index-AgencyClientPaymentTermsProjectionV1-agencyclient-index',
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