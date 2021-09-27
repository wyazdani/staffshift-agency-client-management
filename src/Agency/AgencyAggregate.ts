import {find} from 'lodash';
import {
  AgencyAggregateIdInterface,
  AgencyAggregateRecordInterface,
  AgencyConsultantRoleEnum,
  AgencyConsultantRoleInterface
} from './types';
import {ResourceNotFoundError} from 'a24-node-error-utils';

export class AgencyAggregate {
  constructor(private id: AgencyAggregateIdInterface, private aggregate: AgencyAggregateRecordInterface) {}

  validateConsultantRoleExists(consultantRoleId: string): void {
    if (!find(this.aggregate.consultant_roles, {_id: consultantRoleId})) {
      throw new ResourceNotFoundError('consultant role not found');
    }
  }

  getConsultantRole(consultantRoleId: string): AgencyConsultantRoleInterface {
    return find(this.aggregate.consultant_roles, {_id: consultantRoleId});
  }

  getConsultantRoles(): AgencyConsultantRoleInterface[] {
    return this.aggregate.consultant_roles;
  }

  canEnableConsultantRole(consultantRoleId: string): boolean {
    const role = find(this.aggregate.consultant_roles, {_id: consultantRoleId});

    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }

    return role.status !== AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED;
  }

  canDisableConsultantRole(consultantRoleId: string): boolean {
    const role = find(this.aggregate.consultant_roles, {_id: consultantRoleId});

    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }

    return role.status !== AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED;
  }

  getId(): AgencyAggregateIdInterface {
    return this.id;
  }

  getLastEventId(): number {
    return this.aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON(): AgencyAggregateRecordInterface {
    return this.aggregate;
  }
}
