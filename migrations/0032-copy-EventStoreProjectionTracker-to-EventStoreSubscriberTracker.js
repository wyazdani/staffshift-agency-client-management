'use strict';
const sourceCollection = 'EventStoreProjectionTracker';
const destCollection = 'EventStoreSubscriberTracker';

module.exports = {
  id: '0032-copy-EventStoreProjectionTracker-to-EventStoreSubscriberTracker',
  up: (db, cb) => {
    return db.collection(sourceCollection).find({}).toArray((err, trackerRecords) => {
      if (err) {
        return cb(err);
      }
      if (trackerRecords && trackerRecords.length > 0) {
        return db.collection(destCollection).insertMany(trackerRecords, cb);
      }
      return cb();
    });
  },

  down: (db, cb) => {
    return db.collection(destCollection).deleteMany({}, cb);
  }
};