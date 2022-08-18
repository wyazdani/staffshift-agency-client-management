import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface PaymentTermInterface {
  [index: string]: string;
}
export interface FinancialHoldInterface {
  [index: string]: {
    status: FinancialHoldStatusEnum;
    type: FinancialHoldTypeEnum;
  };
}

export enum PaymentTermEnum {
  STARTED = 'started',
  STARTED_INHERITED = 'started_inherited',
  COMPLETED = 'completed',
  COMPLETED_INHERITED = 'completed_inherited'
}

export enum FinancialHoldStatusEnum {
  STARTED = 'started',
  COMPLETED = 'completed'
}
export enum FinancialHoldTypeEnum {
  APPLIED_INHERITED = 'applied_inherited',
  APPLIED = 'applied',
  CLEARED = 'cleared'
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  payment_term_jobs?: PaymentTermInterface;
  financial_hold_jobs?: FinancialHoldInterface;
}
