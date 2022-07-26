import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface PaymentTermInterface {
  [index: string]: string;
}

export interface OrganisationJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  payment_terms?: PaymentTermInterface;
}
