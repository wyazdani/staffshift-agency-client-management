import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface OrganisationJobInterface {
  [index: string]: string;
}

export enum PaymentTermEnum {
  STARTED = 'started',
  STARTED_INHERITED = 'started_inherited',
  COMPLETED = 'completed',
  COMPLETED_INHERITED = 'completed_inherited'
}

export enum FinancialHoldEnum {
  STARTED = 'started',
  COMPLETED = 'completed',
  APPLY_INHERITED = 'apply_inherited',
  APPLIED = 'applied',
  CLEARED = 'cleared'
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  payment_term_jobs?: OrganisationJobInterface;
  financial_hold_jobs?: OrganisationJobInterface;
  financial_hold_type?: OrganisationJobInterface;
}
