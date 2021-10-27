'use strict';
const {ensureIndexExists, ensureIndexRemoved} = require('../tools/IndexExists');

const indexDetails = {
  'agency_id': 1,
  'client_id': 1
};
const indexOptions = {
  background: true
};
module.exports = {
  id: '0007-agency-client-projection-create-index',
  up: (db, cb) => {
    ensureIndexExists(
      db.collection('AgencyClientsProjection'),
      indexDetails,
      indexOptions
    ).then(() => {
      cb();
    }).catch((err) => {
      cb(err);
    });
  },

  down: (db, cb) => {
    ensureIndexRemoved(
      db.collection('AgencyClientsProjection'),
      indexDetails,
      indexOptions
    ).then(() => {
      cb();
    }).catch((err) => {
      cb(err);
    });
  }
};