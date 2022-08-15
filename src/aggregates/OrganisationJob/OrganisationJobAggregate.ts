import {filter, find, has, includes} from 'lodash';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {AbstractAggregate} from '../AbstractAggregate';
import {OrganisationJobAggregateIdInterface, OrganisationJobAggregateRecordInterface} from './types';
import {
  CompleteApplyFinancialHoldCommandDataInterface,
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteClearFinancialHoldCommandDataInterface,
  CompleteInheritFinancialHoldCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyFinancialHoldCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateClearFinancialHoldCommandDataInterface,
  InitiateInheritFinancialHoldCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from './types/CommandTypes';
import {
  FinancialHoldStatusEnum,
  FinancialHoldTypeEnum,
  PaymentTermEnum
} from './types/OrganisationJobAggregateRecordInterface';

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
      this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.STARTED_INHERITED ||
      this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.COMPLETED_INHERITED
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
  }

  async validateCompleteInheritPaymentTerm(command: CompleteInheritPaymentTermCommandDataInterface): Promise<void> {
    if (
      !has(this.aggregate.payment_term_jobs, command._id) ||
      this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.STARTED ||
      this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.COMPLETED
    ) {
      throw new ResourceNotFoundError(`Job ${command._id} is not found`);
    }

    if (this.aggregate?.payment_term_jobs[command._id] === PaymentTermEnum.COMPLETED_INHERITED) {
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
    this.validatePaymentTermNotRunningAnotherProcess(command._id);
  }

  async validateInitiateApplyPaymentTerm(command: InitiateApplyPaymentTermCommandDataInterface): Promise<void> {
    this.validatePaymentTermNotRunningAnotherProcess(command._id);
  }

  async validateInitiateInheritFinancialHold(command: InitiateInheritFinancialHoldCommandDataInterface): Promise<void> {
    this.validateFinancialHoldNotRunningAnotherProcess(command._id);
  }

  async validateInitiateClearFinancialHold(command: InitiateClearFinancialHoldCommandDataInterface): Promise<void> {
    this.validateFinancialHoldNotRunningAnotherProcess(command._id);
  }

  async validateInitiateApplyFinancialHold(command: InitiateApplyFinancialHoldCommandDataInterface): Promise<void> {
    this.validateFinancialHoldNotRunningAnotherProcess(command._id);
  }

  async validateCompleteApplyFinancialHold(command: CompleteApplyFinancialHoldCommandDataInterface): Promise<void> {
    if (
      !has(this.aggregate.financial_hold_jobs, command._id) ||
      this.aggregate?.financial_hold_jobs[command._id].type !== FinancialHoldTypeEnum.APPLIED
    ) {
      throw new ResourceNotFoundError(`Job ${command._id} is not found`);
    }

    if (this.aggregate?.financial_hold_jobs[command._id].status === FinancialHoldStatusEnum.COMPLETED) {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
        }
      ]);
    }
  }

  async validateCompleteClearFinancialHold(command: CompleteClearFinancialHoldCommandDataInterface): Promise<void> {
    if (
      !has(this.aggregate.financial_hold_jobs, command._id) ||
      this.aggregate?.financial_hold_jobs[command._id].type !== FinancialHoldTypeEnum.CLEARED
    ) {
      throw new ResourceNotFoundError(`Job ${command._id} is not found`);
    }

    if (this.aggregate?.financial_hold_jobs[command._id].status === FinancialHoldStatusEnum.COMPLETED) {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
        }
      ]);
    }
  }

  async validateCompleteInheritFinancialHold(command: CompleteInheritFinancialHoldCommandDataInterface): Promise<void> {
    if (
      !has(this.aggregate.financial_hold_jobs, command._id) ||
      this.aggregate?.financial_hold_jobs[command._id].type !== FinancialHoldTypeEnum.APPLY_INHERITED
    ) {
      throw new ResourceNotFoundError(`Job ${command._id} is not found`);
    }

    if (this.aggregate?.financial_hold_jobs[command._id].status === FinancialHoldStatusEnum.COMPLETED) {
      throw new ValidationError('Job is already completed').setErrors([
        {
          code: 'JOB_ALREADY_COMPLETED',
          message: `Job ${command._id} has already been completed`,
          path: ['_id']
        }
      ]);
    }
  }

  /**
   * checks:
   * - we don't have another job running for payment term
   */
  private validatePaymentTermNotRunningAnotherProcess(id: string) {
    if (
      includes(this.aggregate.payment_term_jobs, PaymentTermEnum.STARTED) ||
      includes(this.aggregate.payment_term_jobs, PaymentTermEnum.STARTED_INHERITED)
    ) {
      throw new ValidationError('Another job active').setErrors([
        {
          code: 'ANOTHER_JOB_PROCESS_ACTIVE',
          message: `Can't create job id ${id}, as there is another job in progress`
        }
      ]);
    }
  }

  /**
   * checks:
   * - we don't have another job running for financial hold
   */
  private validateFinancialHoldNotRunningAnotherProcess(id: string) {
    if (filter(this.aggregate.financial_hold_jobs, {status: FinancialHoldStatusEnum.STARTED}).length > 0) {
      throw new ValidationError('Another job active').setErrors([
        {
          code: 'ANOTHER_JOB_PROCESS_ACTIVE',
          message: `Can't create job id ${id}, as there is another job in progress`
        }
      ]);
    }
  }
}
