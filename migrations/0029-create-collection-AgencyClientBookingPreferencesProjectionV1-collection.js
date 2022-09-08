'use strict';
const collectionName = 'AgencyClientBookingPreferencesProjectionV1';

module.exports = {
  id: '0029-create-collection-AgencyClientBookingPreferencesProjectionV1-collection',

  up: (db, cb) => {
    db.createCollection(collectionName, {collation: {locale: 'en_US', strength: 2}}, cb);
  },
  down: (db, cb) => {
    db.listCollections().toArray((error, collections) => {
      if (error) {
        return cb(error);
      }

      if (!(collections.map((item) => item.name).includes(collectionName))) {
        return cb();
      }

      db.collection(collectionName).drop(cb);
    });
  }
};
