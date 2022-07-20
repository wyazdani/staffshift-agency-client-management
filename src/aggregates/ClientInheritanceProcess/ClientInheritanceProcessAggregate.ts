import {AbstractAggregate} from '../AbstractAggregate';
import {ClientInheritanceProcessAggregateIdInterface, ClientInheritanceProcessAggregateRecordInterface} from './types';
import {ProgressedItemInterface} from './types/ClientInheritanceProcessAggregateRecordInterface';
import {ClientInheritanceProcessAggregateStatusEnum} from './types/ClientInheritanceProcessAggregateStatusEnum';

export class ClientInheritanceProcessAggregate extends AbstractAggregate<
  ClientInheritanceProcessAggregateIdInterface,
  ClientInheritanceProcessAggregateRecordInterface
> {
  constructor(
    protected id: ClientInheritanceProcessAggregateIdInterface,
    protected aggregate: ClientInheritanceProcessAggregateRecordInterface
  ) {
    super(id, aggregate);
  }

  /**
   * retrieves all client ids that we already processed despite their success
   */
  getProgressedItems(): ProgressedItemInterface[] {
    return this.aggregate.progressed_items || [];
  }

  getCurrentStatus(): ClientInheritanceProcessAggregateStatusEnum {
    return this.aggregate.status || ClientInheritanceProcessAggregateStatusEnum.NEW;
  }
}
