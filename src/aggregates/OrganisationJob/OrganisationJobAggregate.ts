import {find, indexOf} from 'lodash';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {ValidationError} from 'a24-node-error-utils';
import {AbstractAggregate} from '../AbstractAggregate';
import {OrganisationJobAggregateIdInterface, OrganisationJobAggregateRecordInterface} from './types';
import {
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from './types/CommandTypes';

export class OrganisationJobAggregate extends AbstractAggregate<
  OrganisationJobAggregateIdInterface,
  OrganisationJobAggregateRecordInterface
> {
  constructor(
    protected id: OrganisationJobAggregateIdInterface,
    protected aggregate: OrganisationJobAggregateRecordInterface
  ) {
    super(id, aggregate);
  }

  validateCompleteApplyPaymentTerm(command: CompleteApplyPaymentTermCommandDataInterface): void {
    this.validateNotRunningAnotherProcess(command._id);
  }

  validateCompleteInheritPaymentTerm(command: CompleteInheritPaymentTermCommandDataInterface): void {
    this.validateNotRunningAnotherProcess(command._id);
  }

  validateInitiateInheritPaymentTerm(command: InitiateInheritPaymentTermCommandDataInterface): void {
    this.validateNotRunningAnotherProcess(command._id);
  }

  validateInitiateApplyPaymentTerm(command: InitiateApplyPaymentTermCommandDataInterface): void {
    this.validateNotRunningAnotherProcess(command._id);
  }
  /**
   * checks:
   * - we don't have another job running for the same organisation
   */
  private validateNotRunningAnotherProcess(organisationId: string) {
    const paymentTermProcess = find(this.aggregate.running_apply_payment_term, (process) => process.job_id.length > 0);
    const inheritTermProcess = find(
      this.aggregate.running_apply_payment_term_inheritance,
      (process) => process.job_id.length > 0
    );

    if (paymentTermProcess || inheritTermProcess) {
      throw new ValidationError('Not allowed organisation').setErrors([
        {
          code: 'ANOTHER_ORGANISATION_PROCESS_ACTIVE',
          message: `There is another job still running for this organisation id ${organisationId}`,
          path: ['organisation id']
        }
      ]);
    }
  }
}
