import {find, includes, indexOf, size} from 'lodash';
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

  async validateCompleteApplyPaymentTerm(command: CompleteApplyPaymentTermCommandDataInterface): Promise<void> {
    if (this.aggregate.running_apply_payment_term?.some((paymentTerm) => paymentTerm.job_id === command._id)) {
      throw new ValidationError('Job Not Completed').setErrors([
        {
          code: 'JOB_NOT_COMPLETED',
          message: `Job ${command._id} is still running`,
          path: ['job id']
        }
      ]);
    }
    this.validateNotRunningAnotherProcess(command._id);
  }

  async validateCompleteInheritPaymentTerm(command: CompleteInheritPaymentTermCommandDataInterface): Promise<void> {
    if (
      this.aggregate.running_apply_payment_term_inheritance?.some((paymentTerm) => paymentTerm.job_id === command._id)
    ) {
      throw new ValidationError('Job Not Completed').setErrors([
        {
          code: 'JOB_NOT_COMPLETED',
          message: `Job ${command._id} is still running`,
          path: ['job id']
        }
      ]);
    }
    this.validateNotRunningAnotherProcess(command._id);
  }

  async validateInitiateInheritPaymentTerm(command: InitiateInheritPaymentTermCommandDataInterface): Promise<void> {
    if (
      this.aggregate.running_apply_payment_term_inheritance?.some((paymentTerm) => paymentTerm.job_id === command._id)
    ) {
      throw new ValidationError('Job Not Completed').setErrors([
        {
          code: 'JOB_NOT_COMPLETED',
          message: `Job ${command._id} is still running`,
          path: ['job id']
        }
      ]);
    }
    this.validateNotRunningAnotherProcess(command._id);
  }

  async validateInitiateApplyPaymentTerm(command: InitiateApplyPaymentTermCommandDataInterface): Promise<void> {
    if (this.aggregate.running_apply_payment_term?.some((paymentTerm) => paymentTerm.job_id === command._id)) {
      throw new ValidationError('Job Not Completed').setErrors([
        {
          code: 'JOB_NOT_COMPLETED',
          message: `Job ${command._id} is still running`,
          path: ['job id']
        }
      ]);
    }
    this.validateNotRunningAnotherProcess(command._id);
  }
  /**
   * checks:
   * - we don't have another job running for the same organisation
   */
  private validateNotRunningAnotherProcess(jobId: string) {
    if (
      size(this.aggregate.running_apply_payment_term_inheritance) + size(this.aggregate.running_apply_payment_term) >
      0
    ) {
      throw new ValidationError('Not allowed job id').setErrors([
        {
          code: 'ANOTHER_JOB_PROCESS_ACTIVE',
          message: `There is another job still running for this job id ${jobId}`,
          path: ['job id']
        }
      ]);
    }
  }
}
