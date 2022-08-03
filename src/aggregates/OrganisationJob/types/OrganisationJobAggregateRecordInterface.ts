import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface PaymentTermInterface {
  [index: string]: string;
}

export enum PaymentTermEnum {
  STARTED = 'started',
  STARTED_INHERITED = 'started_inherited',
  COMPLETED = 'completed'
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  payment_term_jobs?: PaymentTermInterface;
}
