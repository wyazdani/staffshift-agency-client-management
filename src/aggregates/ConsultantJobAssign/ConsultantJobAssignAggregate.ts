import {ConsultantJobAssignAggregateIdInterface, ConsultantJobAssignAggregateRecordInterface} from './types';
import {ConsultantJobAssignAggregateStatusEnum} from './types/ConsultantJobAssignAggregateStatusEnum';

export class ConsultantJobAssignAggregate {
  constructor(
    private id: ConsultantJobAssignAggregateIdInterface,
    private aggregate: ConsultantJobAssignAggregateRecordInterface
  ) {}

  /**
   * retrieves all client ids that we already processed despite their success
   */
  getProgressedClientIds(): string[] {
    return this.aggregate.progressed_client_ids || [];
  }

  getCurrentStatus(): ConsultantJobAssignAggregateStatusEnum {
    return this.aggregate.status || ConsultantJobAssignAggregateStatusEnum.NEW;
  }

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
