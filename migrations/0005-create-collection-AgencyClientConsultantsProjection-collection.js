'use strict';

module.exports = {
  id: '0005-create-collection-AgencyClientConsultantsProjection-collection',

  up: (db, cb) => {
    db.createCollection('AgencyClientConsultantsProjection', {collation: {locale: 'en_US', strength: 2}}, cb);
  },
  down: (db, cb) => {
    db.collection('AgencyClientConsultantsProjection').drop(cb);
  }
};
