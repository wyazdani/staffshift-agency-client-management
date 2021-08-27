'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencyClients = new Schema(
  {
    agency_id: {
      type: String,
      required: true,
      description: 'The agency id'
    },
    client_id: {
      type: String,
      required: true,
      description: 'The client id'
    },
    organisation_id: {
      type: String,
      required: true,
      description: 'The event type / name'
    },
    client_type: {
      type: String,
      required: true,
      description: 'The event type / name'
    },
    linked: {
      type: Boolean,
      required: true,
      description: 'Flag indicating if the client is actually linked'
    }
  },
  // What does created_at AND updated_at represent?
  // This is a projection, does it indicate when the entries where added / updated on the projection?
  {
    // We will most likely need to keep the version key to apply optimistic locks
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClients'
  }
);

/**
 * Defines the model for the AgencyClients Read Projection
 */
module.exports = mongoose.model('AgencyClients', agencyClients);
