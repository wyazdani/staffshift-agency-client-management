import {PaymentTermAggregateIdInterface, PaymentTermAggregateRecordInterface} from './types';
import {AbstractAggregate} from '../AbstractAggregate';
import {ValidationError} from 'a24-node-error-utils';

export class PaymentTermAggregate extends AbstractAggregate<
  PaymentTermAggregateIdInterface,
  PaymentTermAggregateRecordInterface
> {
  constructor(protected id: PaymentTermAggregateIdInterface, protected aggregate: PaymentTermAggregateRecordInterface) {
    super(id, aggregate);
  }

  validateInherited() {
    if (this.aggregate.inherited === false) {
      throw new ValidationError('')// @TODO
    }
  }
}
