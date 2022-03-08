'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');
const collectionName = 'BulkProcessManagerV1';
const indexDetails = {
  created_at: 1
};
const indexOptions = {
  background: true
};
module.exports = {
  id: '0023-create-index-BulkProcessManagerV1-created-at',
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