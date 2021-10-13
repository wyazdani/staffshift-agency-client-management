'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');

let indexDetails = {
  'created_at': 1
};
let indexOptions = {
  background: true
};
module.exports = {
  id: '0006-EventStore-created_at-index',
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