import {ValidationError} from 'a24-node-error-utils';
import {PaymentTermAggregateIdInterface, PaymentTermAggregateRecordInterface} from './types';
import {AbstractAggregate} from '../AbstractAggregate';
import {PAYMENT_TERM_ENUM} from './types/PaymentTermAggregateRecordInterface';

export class PaymentTermAggregate extends AbstractAggregate<
  PaymentTermAggregateIdInterface,
  PaymentTermAggregateRecordInterface
> {
  constructor(protected id: PaymentTermAggregateIdInterface, protected aggregate: PaymentTermAggregateRecordInterface) {
    super(id, aggregate);
  }

  /**
   * Note: the inherited property might `undefined`(when aggregate doesn't have any events). it means it's inherited
   * that's why we don't do `if (!this.aggregate.inherited)`
   */
  validateInherited(): void {
    if (this.aggregate.inherited === false) {
      throw new ValidationError('Operation not possible due to inheritance problem').setErrors([
        {
          code: 'NOT_INHERITED',
          message: 'node is not inherited from the parent'
        }
      ]);
    }
  }

  /**
   * returns the current payment term set
   * null means nothing is set
   */
  getPaymentTerm(): PAYMENT_TERM_ENUM | null {
    return this.aggregate.payment_term || null;
  }

  /**
   * get last event date in the aggregate
   * null means the aggregate was empty
   */
  getLastEventDate(): Date | null {
    return this.aggregate.last_event_date || null;
  }
}
