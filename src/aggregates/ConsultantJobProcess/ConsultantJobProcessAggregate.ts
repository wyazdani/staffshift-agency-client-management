import {AbstractAggregate} from '../AbstractAggregate';
import {ConsultantJobProcessAggregateIdInterface, ConsultantJobProcessAggregateRecordInterface} from './types';
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
  getProgressedClientIds(): string[] {
    return this.aggregate.progressed_client_ids || [];
  }

  getCurrentStatus(): ConsultantJobProcessAggregateStatusEnum {
    return this.aggregate.status || ConsultantJobProcessAggregateStatusEnum.NEW;
  }
}
