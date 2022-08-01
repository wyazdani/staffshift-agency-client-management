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
    if (!has(this.aggregate.payment_term_jobs, command._id)) {
      throw new ValidationError('Job Not Found').setErrors([
        {
          code: 'JOB_NOT_FOUND',
          message: `Job ${command._id} is not found`,
          path: ['_id']
        }
      ]);
    }

    if (this.aggregate?.payment_term_jobs[command._id] === 'completed') {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
        }
      ]);
    }
  }

  async validateCompleteInheritPaymentTerm(command: CompleteInheritPaymentTermCommandDataInterface): Promise<void> {
    if (!has(this.aggregate.payment_term_jobs, command._id)) {
      throw new ValidationError('Job Not Found').setErrors([
        {
          code: 'JOB_NOT_FOUND',
          message: `Job ${command._id} is not found`,
          path: ['_id']
        }
      ]);
    }

    if (this.aggregate?.payment_term_jobs[command._id] === 'completed') {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
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
  private validateNotRunningAnotherProcess(id: string) {
    if (includes(this.aggregate.payment_term_jobs, 'started')) {
      throw new ValidationError('Another job active').setErrors([
        {
          code: 'ANOTHER_JOB_PROCESS_ACTIVE',
          message: `Can't create job id ${id}, as there is another job in progress`,
          path: ['_id']
        }
      ]);
    }
  }
}
