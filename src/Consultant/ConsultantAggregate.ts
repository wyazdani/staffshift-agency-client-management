import {ConsultantAggregateIdInterface, ConsultantAggregateRecordInterface} from './types';

export class ConsultantAggregate {
  constructor(
    private id: ConsultantAggregateIdInterface,
    private aggregate: ConsultantAggregateRecordInterface
  ) {}

  /**
   * Return the aggregate ID
   */
  getId(): ConsultantAggregateIdInterface {
    return this.id;
  }

  /**
   * Return the previous aggregate ID
   */
  getLastEventId(): number {
    return this.aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON(): ConsultantAggregateRecordInterface {
    return this.aggregate;
  }
}
