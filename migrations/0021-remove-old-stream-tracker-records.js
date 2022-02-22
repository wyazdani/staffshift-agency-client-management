'use strict';
const recordIds = ['event_store_projection_watch', 'agency_consultant_roles_event_store_watch',
  'agency_client_event_store_watch', 'agency_client_consultant_event_store_watch']

module.exports = {
  id: '0021-remove-old-stream-tracker-records',

  up: (db, cb) => {
    db.collection('StreamTracker').deleteMany({
      _id: {
        $in: recordIds
      }
    }, cb);
  },
  down: (db, cb) => {
    cb();
  }
};
