'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencyClientConsultantsSchema = new Schema(
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
    consultant_role_id: {
      type: String,
      required: true,
      description: 'The consultant role id'
    },
    consultant_role_name: {
      type: String,
      required: true,
      description: 'The consultant role name'
    },
    consultant_id: {
      type: String,
      required: true,
      description: 'The consultant id, a reference to the staffshift user_id'
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
    collection: 'AgencyClientConsultants'
  }
);

/**
 * Defines the model for the AgencyClientConsultants Read Projection
 */
module.exports = mongoose.model('AgencyClientConsultants', agencyClientConsultantsSchema);
