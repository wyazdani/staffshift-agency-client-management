import {countBy, find} from 'lodash';
import {ValidationError} from 'a24-node-error-utils';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {
  AgencyClientAggregateIdInterface,
  AgencyClientAggregateRecordInterface,
  AgencyClientConsultantInterface
} from './types';

export class AgencyClientAggregate {
  constructor(
    private id: AgencyClientAggregateIdInterface,
    private aggregate: AgencyClientAggregateRecordInterface,
    private agencyRepository: AgencyRepository
  ) {}

  /**
   * Check if agency client is linked or not
   */
  isLinked(): boolean {
    return !!this.aggregate.linked;
  }

  /**
   * Check all invariants of the agency client aggregate before adding a new agency client consultant
   */
  async validateAddClientConsultant(consultant: AgencyClientConsultantInterface): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate(this.id.agency_id);
    // Should this be another aggregate?
    const consultantRole = agencyAggregate.getConsultantRole(consultant.consultant_role_id);
    const currentCount =
      countBy(this.aggregate.consultants, {consultant_role_id: consultant.consultant_role_id}).true || 0;

    if (!consultantRole) {
      throw new ValidationError(`Consultant role ${consultant.consultant_role_id} does not not exist`);
    }

    if (currentCount + 1 > consultantRole.max_consultants) {
      throw new ValidationError(`Too many consultants for the role ${consultant.consultant_role_id}`);
    }

    if (consultantRole.status != 'enabled') {
      throw new ValidationError(`Consultant role ${consultant.consultant_role_id} is not enabled`);
    }
  }

  /**
   * Check all invariants of the agency client aggregate before removing an agency client consultant
   */
  async validateRemoveClientConsultant(consultant: AgencyClientConsultantInterface): Promise<void> {
    if (find(this.aggregate.consultants, {_id: consultant._id}) === undefined) {
      throw new ValidationError('Consultant that was supposed to be removed does not exist');
    }
  }

  /**
   * Return a list of agency client consultants
   */
  getConsultants(): AgencyClientConsultantInterface[] {
    return this.aggregate.consultants;
  }

  /**
   * Return the agency client aggregate ID
   */
  getId(): AgencyClientAggregateIdInterface {
    return this.id;
  }

  /**
   * Return the previous agency client aggregate ID
   */
  getLastEventId(): number {
    return this.aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON(): AgencyClientAggregateRecordInterface {
    return this.aggregate;
  }
}
