import {AbstractAggregate} from '../AbstractAggregate';
import {ConsultantJobProcessAggregateIdInterface, ConsultantJobProcessAggregateRecordInterface} from './types';
import {ProgressedItemInterface} from './types/ConsultantJobProcessAggregateRecordInterface';
import {ConsultantJobProcessAggregateStatusEnum} from './types/ConsultantJobProcessAggregateStatusEnum';

export class ConsultantJobProcessAggregate extends AbstractAggregate<
  ConsultantJobProcessAggregateIdInterface,
  ConsultantJobProcessAggregateRecordInterface
> {
  constructor(
    protected id: ConsultantJobProcessAggregateIdInterface,
    protected aggregate: ConsultantJobProcessAggregateRecordInterface
  ) {
    super(id, aggregate);
  }

  /**
   * retrieves all client ids that we already processed despite their success
   */
  getProgressedItems(): ProgressedItemInterface[] {
    return this.aggregate.progressed_items || [];
  }

  getCurrentStatus(): ConsultantJobProcessAggregateStatusEnum {
    return this.aggregate.status || ConsultantJobProcessAggregateStatusEnum.NEW;
  }
}
