'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventStoreSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      description: 'The unique identifier'
    },
    type: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at'
    },
    collection: 'EventStore',
    _id: false
  }
);

/**
 * Defines the model for the Event Store
 */
module.exports = mongoose.model('EventStore', eventStoreSchema);
