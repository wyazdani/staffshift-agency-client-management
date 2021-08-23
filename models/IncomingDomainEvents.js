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
 * Defines the model for the Event Store
 */
module.exports = mongoose.model('IncomingDomainEvents', incomingDomainEventsSchema);
