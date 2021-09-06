'use strict';
const _ = require('lodash');

class AgencyClientAggregate {

  // Should we rather have all the events here?
  constructor(id, aggregate, agencyRepository) {
    this._id = id;
    this._aggregate = aggregate;
    this._agency_repository = agencyRepository;
  }

  isLinked() {
    return !!this._aggregate.linked;
  }

  // Business Logic that should be applied
  async validateAddClientConsultant(consultant) {
    const agencyAggregate = await this._agency_repository.getAggregate(this._id.agency_id);
    // Should this be another aggregate?
    const consultantRole = agencyAggregate.getConsultantRole(consultant.consultant_role_id);
    const currentCount = _.countBy(this._aggregate.consultants, {consultant_role_id: consultant.consultant_role_id}).true || 0;

    if (!consultantRole) {
      throw new Error(`CONSULTANT ROLE ${consultant.consultant_role_id} NOT DEFINED`);
    }

    if ((currentCount + 1) > consultantRole.max_consultants) {
      throw new Error(`TOO MANY CONSULTANTS FOR THE ROLE ${consultant.consultant_role_id}`);
    }

    if (consultantRole.status != 'enabled') {
      throw new Error(`CONSULTANT ROLE ${consultant.consultant_role_id} IS NOT ENABLED`);
    }
  }

  async validateRemoveClientConsultant(consultant) {
    // prevent us from deleting something that does not exist
    if (_.find(this._aggregate.consultants, {_id: consultant._id}) === undefined) {
      throw new Error('CONSULTANT NOT FOUND');
    }
  }

  getConsultants() {
    return this._aggregate.consultants;
  }

  getId() {
    return this._id;
  }

  getLastEventId() {
    return this._aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON() {
    return this._aggregate;
  }
}

module.exports = {AgencyClientAggregate};