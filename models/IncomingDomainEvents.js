'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomingDomainEventsSchema = new Schema(
  {
    event: {
      type: Object,
      required: true
    },
    event_data: {
      type: Object,
      required: true
    },
    application_jwt: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'IncomingDomainEvents',
    _id: false
  }
);

/**
 * Defines the model for the IncomingDomainEvents, stored merely for debugging historical scenarios
 * We are never going to use this collection to populate / process within this service
 */
module.exports = mongoose.model('IncomingDomainEvents', incomingDomainEventsSchema);
