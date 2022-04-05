import {countBy, find, isUndefined} from 'lodash';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
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
      throw new ValidationError('Consultant role not found', [
        {
          code: 'CONSULTANT_ROLE_NOT_FOUND',
          message: `Consultant role ${consultant.consultant_role_id} does not not exist`,
          path: ['consultant_role_id']
        }
      ]);
    }

    if (currentCount + 1 > consultantRole.max_consultants) {
      throw new ValidationError('Max consultants already assigned', [
        {
          code: 'MAX_CONSULTANTS_ASSIGNED',
          message: `Max consultants already assigned for consultant role id: ${consultant.consultant_role_id}`,
          path: ['consultant_role_id']
        }
      ]);
    }

    if (consultantRole.status != 'enabled') {
      throw new ValidationError('Consultant role not enabled', [
        {
          code: 'CONSULTANT_ROLE_NOT_ENABLED',
          message: `Consultant role ${consultant.consultant_role_id} is not enabled`,
          path: ['consultant_role_id']
        }
      ]);
    }

    if (
      find(this.aggregate.consultants, {
        consultant_role_id: consultant.consultant_role_id,
        consultant_id: consultant.consultant_id
      })
    ) {
      throw new ValidationError('Consultant already assigned', [
        {
          code: 'CONSULTANT_ALREADY_ASSIGNED_ROLE',
          message: `Consultant ${consultant.consultant_id} already assigned to role ${consultant.consultant_role_id}`,
          path: ['consultant_id']
        }
      ]);
    }

    if (isUndefined(this.aggregate.linked)) {
      throw new ResourceNotFoundError('Agency client not found');
    }
  }

  /**
   * Check all invariants of the agency client aggregate before removing an agency client consultant
   */
  async validateRemoveClientConsultant(consultant: AgencyClientConsultantInterface): Promise<void> {
    if (find(this.aggregate.consultants, {_id: consultant._id}) === undefined) {
      throw new ResourceNotFoundError('Consultant that was supposed to be removed does not exist');
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
