import {ValidationError} from 'a24-node-error-utils';
import {PaymentTermAggregateIdInterface, PaymentTermAggregateRecordInterface} from './types';
import {AbstractAggregate} from '../AbstractAggregate';

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
  validateInherited() {
    if (this.aggregate.inherited === false) {
      throw new ValidationError('Operation not possible due to inheritance problem').setErrors([
        {
          code: 'NOT_INHERITED',
          message: 'node is not inherited from the parent'
        }
      ]);
    }
  }
}
