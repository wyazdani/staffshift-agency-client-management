'use strict';

module.exports = {
  id: '0004-drop-old-AgencyClientConsultants-collection',

  up: (db, cb) => {
    db.collection('AgencyClientConsultants').drop(cb);
  },
  down: (db, cb) => {
    db.createCollection('AgencyClientConsultants', {collation: {locale: 'en_US', strength: 2}}, cb);
  }
};
