'use strict';
const collectionName = 'EventStoreProjectionTracker';

module.exports = {
  id: '0033-drop-EventStoreProjectionTracker-collection',

  up: (db, cb) => {
    db.listCollections().toArray((error, collections) => {
      if (error) {
        return cb(error);
      }

      if (!(collections.map((item) => item.name).includes(collectionName))) {
        return cb();
      }

      db.collection(collectionName).drop(cb);
    });
  },
  down: (db, cb) => {
    db.createCollection(collectionName, {collation: {locale: 'en_US', strength: 2}}, cb);
  }
};
