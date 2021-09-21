import {AgencyConsultantRoleEnum} from './AgencyEnums';
import {find} from 'lodash';
import {AgencyAggregateRecordInterface, AgencyAggregateIdInterface, AgencyConsultantRoleInterface} from './Interfaces';

export class AgencyAggregate {
  constructor(private id: AgencyAggregateIdInterface, private aggregate: AgencyAggregateRecordInterface) {
  }

  getConsultantRole(consultantRoleId: string): AgencyConsultantRoleInterface {
    return find(this.aggregate.consultant_roles, {_id: consultantRoleId});
  }

  getConsultantRoles(): AgencyConsultantRoleInterface[] {
    return this.aggregate.consultant_roles;
  }

  canEnableConsultantRole(consultantRoleId: string): boolean {
    const role =  find(this.aggregate.consultant_roles, {_id: consultantRoleId});
    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }
    return role.status !== AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED;
  }

  canDisableConsultantRole(consultantRoleId: string): boolean {
    const role =  find(this.aggregate.consultant_roles, {_id: consultantRoleId});
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