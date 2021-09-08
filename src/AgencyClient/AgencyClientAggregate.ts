import {AgencyClientAggregateId, AgencyClientAggregateRecord, AgencyClientConsultant} from './Interfaces';
import _ from 'lodash';
import {AgencyRepository} from '../Agency/AgencyRepository';

export class AgencyClientAggregate {
  private readonly id: AgencyClientAggregateId;
  private readonly aggregate: AgencyClientAggregateRecord;
  private readonly agencyRepository: AgencyRepository;
  constructor(id: any, aggregate: AgencyClientAggregateRecord, agencyRepository: AgencyRepository) {
    this.id = id;
    this.aggregate = aggregate;
    this.agencyRepository = agencyRepository;
  }
  isLinked(): boolean {
    return !!this.aggregate.linked;
  }
  // Business Logic that should be applied
  async validateAddClientConsultant(consultant: AgencyClientConsultant): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate(this.id.agency_id);
    // Should this be another aggregate?
    const consultantRole = agencyAggregate.getConsultantRole(consultant.consultant_role_id);
    const currentCount = _.countBy(this.aggregate.consultants, {consultant_role_id: consultant.consultant_role_id}).true || 0;

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
  async validateRemoveClientConsultant(consultant: AgencyClientConsultant): Promise<void> {
    // prevent us from deleting something that does not exist
    if (_.find(this.aggregate.consultants, {_id: consultant._id}) === undefined) {
      throw new Error('CONSULTANT NOT FOUND');
    }
  }

  getConsultants(): AgencyClientConsultant[] {
    return this.aggregate.consultants;
  }

  getId(): AgencyClientAggregateId {
    return this.id;
  }

  getLastEventId(): number {
    return this.aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON() {
    return this.aggregate;
  }
}