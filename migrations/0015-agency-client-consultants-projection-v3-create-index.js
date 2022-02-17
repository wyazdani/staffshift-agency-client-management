'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');
const collectionName = 'AgencyClientConsultantsProjectionV3';
const indexDetails = {
  consultant_id: 1
};
const indexOptions = {
  background: true
};
module.exports = {
  id: '0015-agency-client-consultants-projection-v3-create-index',
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