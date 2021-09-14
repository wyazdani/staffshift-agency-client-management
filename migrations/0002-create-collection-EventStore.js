'use strict';

module.exports = {
  id: '0002-EventStore-aggregate-sequence-unique-index',
  up: (db, cb) => {
    db.createCollection('EventStore', cb);
  },

  down: (db, cb) => {
    db.collection('EventStore').drop(cb);
  }
};