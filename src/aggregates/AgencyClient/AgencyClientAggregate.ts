import {countBy, find, isUndefined} from 'lodash';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {
  AgencyClientAggregateIdInterface,
  AgencyClientAggregateRecordInterface,
  AgencyClientConsultantInterface
} from './types';
import {AbstractAggregate} from '../AbstractAggregate';
import {TransferAgencyClientConsultantCommandDataInterface} from './types/CommandDataTypes';

export class AgencyClientAggregate extends AbstractAggregate<
  AgencyClientAggregateIdInterface,
  AgencyClientAggregateRecordInterface
> {
  constructor(
    protected id: AgencyClientAggregateIdInterface,
    protected aggregate: AgencyClientAggregateRecordInterface,
    private agencyRepository: AgencyRepository
  ) {
    super(id, aggregate);
  }

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
    await this.validateConsultantRoleForConsultantAssignment('consultant_role_id', consultant.consultant_role_id);
    this.validateConsultantForConsultantAssignment(
      'consultant_id',
      consultant.consultant_id,
      consultant.consultant_role_id
    );
    this.validateAgencyClientExistence();
  }

  /**
   * Check all invariants of the agency client aggregate before removing an agency client consultant
   */
  async validateRemoveClientConsultant(consultant: AgencyClientConsultantInterface): Promise<void> {
    this.validateConsultantExistence(consultant._id);
  }

  /**
   * Validate transferring clients for a consultant to another consultant
   *
   * We skip consultant role checks since we don't care if consultant in the destination is enabled/disabled,
   * or we hit the max consultant
   */
  async validateTransferClientConsultant(command: TransferAgencyClientConsultantCommandDataInterface): Promise<void> {
    this.validateAgencyClientExistence();
    this.validateConsultantExistence(command.from_id);
    await this.validateConsultantRoleForConsultantAssignment(
      'to_consultant_role_id',
      command.to_consultant_role_id,
      false,
      false
    );
  }

  /**
   * Checks if consultant with this id and role is already assigned to this client?
   */
  isConsultantAlreadyAssigned(consultantId: string, consultantRoleId: string): boolean {
    return !!find(this.aggregate.consultants, {
      consultant_role_id: consultantRoleId,
      consultant_id: consultantId
    });
  }

  /**
   * Return a list of agency client consultants
   */
  getConsultants(): AgencyClientConsultantInterface[] {
    return this.aggregate.consultants;
  }

  /**
   * Doing validation to check if we can assign this consultant role to a client for a consultant
   */
  private async validateConsultantRoleForConsultantAssignment(
    fieldName: string,
    consultantRoleId: string,
    checkMaxConsultants: boolean = true,
    checkRoleEnabled: boolean = true
  ): Promise<void> {
    // Should this be another aggregate?
    // Answer: we are checking something inside another aggregate. we decided to continue doing this
    const agencyAggregate = await this.agencyRepository.getAggregate({agency_id: this.id.agency_id});
    const consultantRole = agencyAggregate.getConsultantRole(consultantRoleId);
    const currentCount = countBy(this.aggregate.consultants, {consultant_role_id: consultantRoleId}).true || 0;

    if (!consultantRole) {
      throw new ValidationError('Consultant role not found').setErrors([
        {
          code: 'CONSULTANT_ROLE_NOT_FOUND',
          message: `Consultant role ${consultantRoleId} does not not exist`,
          path: [fieldName]
        }
      ]);
    }

    if (checkMaxConsultants && currentCount + 1 > consultantRole.max_consultants) {
      throw new ValidationError('Max consultants already assigned').setErrors([
        {
          code: 'MAX_CONSULTANTS_ASSIGNED',
          message: `Max consultants already assigned for consultant role id: ${consultantRoleId}`,
          path: [fieldName]
        }
      ]);
    }

    if (checkRoleEnabled && consultantRole.status != 'enabled') {
      throw new ValidationError('Consultant role not enabled').setErrors([
        {
          code: 'CONSULTANT_ROLE_NOT_ENABLED',
          message: `Consultant role ${consultantRoleId} is not enabled`,
          path: [fieldName]
        }
      ]);
    }
  }

  private validateConsultantForConsultantAssignment(fieldName: string, consultantId: string, consultantRoleId: string) {
    if (
      find(this.aggregate.consultants, {
        consultant_role_id: consultantRoleId,
        consultant_id: consultantId
      })
    ) {
      throw new ValidationError('Consultant already assigned').setErrors([
        {
          code: 'CONSULTANT_ALREADY_ASSIGNED_ROLE',
          message: `Consultant ${consultantId} already assigned to role ${consultantRoleId}`,
          path: [fieldName]
        }
      ]);
    }
  }

  private validateConsultantExistence(consultantAssignmentId: string) {
    if (find(this.aggregate.consultants, {_id: consultantAssignmentId}) === undefined) {
      throw new ResourceNotFoundError('Consultant that was supposed to be removed does not exist');
    }
  }

  private validateAgencyClientExistence() {
    if (isUndefined(this.aggregate.linked)) {
      throw new ResourceNotFoundError('Agency client not found');
    }
  }
}
