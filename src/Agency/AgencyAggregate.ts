import {AgencyConsultantRoleEnums} from './AgencyEnums';
import _ from 'lodash';
import {AgencyAggregateRecord, AgencyAggregateId, AgencyConsultantRole} from './Interfaces';

export class AgencyAggregate {
  constructor(private id: AgencyAggregateId, private aggregate: AgencyAggregateRecord) {
  }

  getConsultantRole(consultantRoleId: string): AgencyConsultantRole {
    return _.find(this.aggregate.consultant_roles, {_id: consultantRoleId});
  }

  getConsultantRoles(): AgencyConsultantRole[] {
    return this.aggregate.consultant_roles;
  }

  canEnableConsultantRole(consultantRoleId: string): boolean {
    const role =  _.find(this.aggregate.consultant_roles, {_id: consultantRoleId});
    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }
    return role.status !== AgencyConsultantRoleEnums.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED;
  }

  canDisableConsultantRole(consultantRoleId: string): boolean {
    const role =  _.find(this.aggregate.consultant_roles, {_id: consultantRoleId});
    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }
    return role.status !== AgencyConsultantRoleEnums.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED;
  }
  getId(): AgencyAggregateId {
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