import {find} from 'lodash';
import {AbstractAggregate} from '../AbstractAggregate';
import {
  AgencyAggregateIdInterface,
  AgencyAggregateRecordInterface,
  AgencyConsultantRoleEnum,
  AgencyConsultantRoleInterface
} from './types';
import {ResourceNotFoundError} from 'a24-node-error-utils';

export class AgencyAggregate extends AbstractAggregate<AgencyAggregateIdInterface, AgencyAggregateRecordInterface>{
  validateUpdateConsultantRole(consultantRoleId: string): void {
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
      throw new ResourceNotFoundError('Consultant role not found');
    }

    return role.status !== AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED;
  }

  canDisableConsultantRole(consultantRoleId: string): boolean {
    const role = find(this.aggregate.consultant_roles, {_id: consultantRoleId});

    if (!role) {
      throw new ResourceNotFoundError('Consultant role not found');
    }

    return role.status !== AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED;
  }
}
