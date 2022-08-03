import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface PaymentTermInterface {
  [index: string]: string | boolean;
}

export enum PaymentTermEnum {
  STARTED = 'started',
  COMPLETED = 'completed'
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  payment_term_jobs?: PaymentTermInterface;
  payment_term_job_inherited?: PaymentTermInterface;
}
