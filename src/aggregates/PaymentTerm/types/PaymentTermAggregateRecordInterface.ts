import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export enum PAYMENT_TERM_ENUM {
  CREDIT = 'credit',
  PAY_IN_ADVANCE = 'pay_in_advance'
}

export interface PaymentTermAggregateRecordInterface extends BaseAggregateRecordInterface {
  inherited?: boolean;
  payment_term?: PAYMENT_TERM_ENUM | null;
}
