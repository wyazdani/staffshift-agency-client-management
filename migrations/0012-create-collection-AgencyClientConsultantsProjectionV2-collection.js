'use strict';
const collectionName = 'AgencyClientConsultantsProjectionV2';

module.exports = {
  id: '0012-create-collection-AgencyClientConsultantsProjectionV2-collection',

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
