import {has, includes} from 'lodash';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {AbstractAggregate} from '../AbstractAggregate';
import {OrganisationJobAggregateIdInterface, OrganisationJobAggregateRecordInterface} from './types';
import {
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from './types/CommandTypes';
import {PaymentTermEnum} from './types/OrganisationJobAggregateRecordInterface';

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
    if (
      !has(this.aggregate.payment_term_jobs, command._id) ||
      !has(this.aggregate.payment_term_job_inherited, command._id)
    ) {
      throw new ResourceNotFoundError(`Job ${command._id} is not found`);
    }

    if (this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.COMPLETED) {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
        }
      ]);
    }
    if (this.aggregate?.payment_term_job_inherited[command._id] === true) {
      throw new ValidationError('Job is inherited').setErrors([
        {
          code: 'JOB_INHERITED',
          message: `Job ${command._id} has been inherited`,
          path: ['_id']
        }
      ]);
    }
  }

  async validateCompleteInheritPaymentTerm(command: CompleteInheritPaymentTermCommandDataInterface): Promise<void> {
    if (
      !has(this.aggregate.payment_term_jobs, command._id) ||
      !has(this.aggregate.payment_term_job_inherited, command._id)
    ) {
      throw new ResourceNotFoundError(`Job ${command._id} is not found`);
    }

    if (this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.COMPLETED) {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
        }
      ]);
    }

    if (this.aggregate?.payment_term_job_inherited[command._id] === false) {
      throw new ValidationError('Job not inherited').setErrors([
        {
          code: 'JOB_NOT_INHERITED',
          message: `Job ${command._id} has not been inherited`,
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
    if (includes(this.aggregate.payment_term_jobs, PaymentTermEnum.STARTED)) {
      throw new ValidationError('Another job active').setErrors([
        {
          code: 'ANOTHER_JOB_PROCESS_ACTIVE',
          message: `Can't create job id ${id}, as there is another job in progress`
        }
      ]);
    }
  }
}
