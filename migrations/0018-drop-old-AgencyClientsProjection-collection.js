'use strict';
const collectionName = 'AgencyClientsProjection';

module.exports = {
  id: '0018-drop-old-AgencyClientsProjection-collection',

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
