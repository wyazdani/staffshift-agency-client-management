'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');

const indexDetails = {
  aggregate_id: 1,
  sequence_id: 1
};

const indexOptions = {
  background: true,
  unique: true
};

module.exports = {
  id: '0003-EventStore-aggregate-sequence-unique-index',
  up: (db, cb) => {
    ensureIndexExists(db.collection('EventStore'), indexDetails, indexOptions)
      .then(() => {
        cb();
      })
      .catch((err) => {
        cb(err);
      });
  },

  down: (db, cb) => {
    ensureIndexRemoved(db.collection('EventStore'), indexDetails, indexOptions)
      .then(() => {
        cb();
      })
      .catch((err) => {
        cb(err);
      });
  }
};
