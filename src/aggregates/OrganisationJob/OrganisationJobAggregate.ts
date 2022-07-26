import {has, includes} from 'lodash';
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
    if (!has(this.aggregate.payment_terms, command._id)) {
      throw new ValidationError('Job Not Found').setErrors([
        {
          code: 'JOB_NOT_FOUND',
          message: `Job ${command._id} is not found`,
          path: ['job id']
        }
      ]);
    }

    if (this.aggregate?.payment_terms[command._id] === 'completed') {
      throw new ValidationError('Job Completed').setErrors([
        {
          code: 'JOB_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['job id']
        }
      ]);
    }
  }

  async validateCompleteInheritPaymentTerm(command: CompleteInheritPaymentTermCommandDataInterface): Promise<void> {
    if (!has(this.aggregate.payment_terms, command._id)) {
      throw new ValidationError('Job Not Found').setErrors([
        {
          code: 'JOB_NOT_FOUND',
          message: `Job ${command._id} is not found`,
          path: ['job id']
        }
      ]);
    }

    if (this.aggregate?.payment_terms[command._id] === 'completed') {
      throw new ValidationError('Job Completed').setErrors([
        {
          code: 'JOB_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['job id']
        }
      ]);
    }
  }

  async validateInitiateInheritPaymentTerm(command: InitiateInheritPaymentTermCommandDataInterface): Promise<void> {
    this.validateNotRunningAnotherProcess(command._id);
  }

  async validateInitiateApplyPaymentTerm(command: InitiateApplyPaymentTermCommandDataInterface): Promise<void> {
    this.validateNotRunningAnotherProcess(command._id);
  }
  /**
   * checks:
   * - we don't have another job running for the same organisation
   */
  private validateNotRunningAnotherProcess(jobId: string) {
    if (includes(this.aggregate.payment_terms, 'started')) {
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
