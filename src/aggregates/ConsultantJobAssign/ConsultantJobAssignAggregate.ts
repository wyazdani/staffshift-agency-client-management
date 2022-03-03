import {ConsultantJobAssignAggregateIdInterface, ConsultantJobAssignAggregateRecordInterface} from './types';

export class ConsultantJobAssignAggregate {
  constructor(
    private id: ConsultantJobAssignAggregateIdInterface,
    private aggregate: ConsultantJobAssignAggregateRecordInterface
  ) {}

  /**
   * Return the aggregate ID
   */
  getId(): ConsultantJobAssignAggregateIdInterface {
    return this.id;
  }

  /**
   * Return the previous aggregate ID
   */
  getLastEventId(): number {
    return this.aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON(): ConsultantJobAssignAggregateRecordInterface {
    return this.aggregate;
  }
}
