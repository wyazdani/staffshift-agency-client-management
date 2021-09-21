'use strict';

module.exports = {
  id: '0002-create-collection-EventStore',
  up: (db, cb) => {
    db.createCollection('EventStore', cb);
  },

  down: (db, cb) => {
    db.collection('EventStore').drop(cb);
  }
};
