'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');

let indexDetails = {
  'aggregate_id': 1,
  'sequence_id': 1
};
let indexOptions = {
  background: true,
  unique: true
};
module.exports = {
  id: '0003-EventStore-aggregate-sequence-unique-index',
  up: (db, cb) => {
    ensureIndexExists(
      db.collection('EventStore'),
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
      db.collection('EventStore'),
      indexDetails,
      indexOptions
    ).then(() => {
      cb();
    }).catch((err) => {
      cb(err);
    });
  }
};