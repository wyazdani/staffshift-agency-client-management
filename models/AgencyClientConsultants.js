'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencyClientConsultantsSchema = new Schema(
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
    consultant_role_id: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    consultant_role_name: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    consultant_id: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    }
  },
  // What does created_at AND updated_at represent?
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientConsultants'
  }
);

/**
 * Defines the model for the Event Store
 */
module.exports = mongoose.model('AgencyClientConsultants', agencyClientConsultantsSchema);
