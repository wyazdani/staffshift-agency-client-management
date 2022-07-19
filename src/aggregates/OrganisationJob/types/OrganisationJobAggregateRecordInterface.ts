import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface OrganisationJobAggregateRecordProcessInterface {
  job_id: string[];
}

export enum PAYMENT_TERM_ENUM {
  CREDIT = 'credit',
  PAY_IN_ADVANCE = 'pay_in_advance'
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  running_apply_payment_term?: OrganisationJobAggregateRecordProcessInterface[];
  running_apply_payment_term_inheritance?: OrganisationJobAggregateRecordProcessInterface[];
}
