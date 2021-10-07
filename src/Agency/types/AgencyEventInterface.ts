import {AgencyEventEnum} from './AgencyEventEnum';
import {AgencyAggregateIdInterface} from './AgencyAggregateIdInterface';

export interface AgencyEventInterface<EventDataType> {
  type: AgencyEventEnum;
  aggregate_id: AgencyAggregateIdInterface;
  data: EventDataType;
  sequence_id: number;
}
