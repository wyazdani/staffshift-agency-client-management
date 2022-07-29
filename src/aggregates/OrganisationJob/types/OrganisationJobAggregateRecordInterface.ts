import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface PaymentTermInterface {
  [index: string]: string;
}
export interface PaymentTermInheritedInterface {
  [index: string]: boolean;
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  payment_term_jobs?: PaymentTermInterface;
  payment_term_job_inherited?: PaymentTermInheritedInterface;
}
