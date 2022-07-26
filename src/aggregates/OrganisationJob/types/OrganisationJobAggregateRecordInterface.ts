import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface OrganisationJobAggregateRecordProcessInterface {
  job_id: string;
}

export interface PaymentTermInterface {
  [index: string]: string;
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  running_apply_payment_term?: OrganisationJobAggregateRecordProcessInterface[];
  running_apply_payment_term_inheritance?: OrganisationJobAggregateRecordProcessInterface[];
  payment_terms?: PaymentTermInterface;
}
