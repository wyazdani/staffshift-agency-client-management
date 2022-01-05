'use strict';

const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');
const collectionName = 'EventStore';
const indexDetails = {
  created_at: 1,
  _id: 1
};
const indexOptions = {
  background: true
};
module.exports = {
  id: '0009-EventStore-compound-index',
  up: (db, cb) => {
    ensureIndexExists(db.collection(collectionName), indexDetails, indexOptions)
      .then(() => cb())
      .catch((err) => cb(err));
  },

  down: (db, cb) => {
    ensureIndexRemoved(db.collection(collectionName), indexDetails, indexOptions)
      .then(() => cb())
      .catch((err) => cb(err));
  }
};