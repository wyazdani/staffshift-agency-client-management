'use strict';
const collectionName = 'AgencyClientEventLog';

module.exports = {
  id: '0024-drop-AgencyClientEventLog-collection',

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
  down: (db,cb) => {
    cb();
  }
};