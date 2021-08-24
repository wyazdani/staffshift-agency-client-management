'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencyClientEventLog = new Schema(
  {
    agency_id: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    client_id: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    event: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    snapshot: {
      type: Object,
      required: true,
      description: 'The event type aka the event name'
    },
    evented_at: {
      type: Date,
      required: true
    }
  },
  // What does created_at AND updated_at represent?
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientEventLog'
  }
);

/**
 * Defines the model for the Event Store
 */
module.exports = mongoose.model('AgencyClientEventLog', agencyClientEventLog);
