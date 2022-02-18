'use strict';
const collectionName = 'AgencyClientConsultantsProjectionV3';

module.exports = {
  id: '0014-create-collection-AgencyClientConsultantsProjectionV3-collection',

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
