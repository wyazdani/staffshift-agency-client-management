'use strict';
const collectionName = 'AgencyClientConsultantsProjection';

module.exports = {
  id: '0005-create-collection-AgencyClientConsultantsProjection-collection',

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
