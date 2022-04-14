import {AbstractAggregate} from '../AbstractAggregate';
import {ConsultantJobAssignAggregateIdInterface, ConsultantJobAssignAggregateRecordInterface} from './types';
import {ConsultantJobAssignAggregateStatusEnum} from './types/ConsultantJobAssignAggregateStatusEnum';

export class ConsultantJobAssignAggregate extends AbstractAggregate<
  ConsultantJobAssignAggregateIdInterface,
  ConsultantJobAssignAggregateRecordInterface
> {
  constructor(
    protected id: ConsultantJobAssignAggregateIdInterface,
    protected aggregate: ConsultantJobAssignAggregateRecordInterface
  ) {
    super(id, aggregate);
  }

  /**
   * retrieves all client ids that we already processed despite their success
   */
  getProgressedClientIds(): string[] {
    return this.aggregate.progressed_client_ids || [];
  }

  getCurrentStatus(): ConsultantJobAssignAggregateStatusEnum {
    return this.aggregate.status || ConsultantJobAssignAggregateStatusEnum.NEW;
  }
}
