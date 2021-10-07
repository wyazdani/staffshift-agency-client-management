import {AgencyClientEventEnum} from './AgencyClientEventEnum';
import {AgencyClientAggregateIdInterface} from './AgencyClientAggregateIdInterface';

export interface AgencyClientEventInterface<EventDataType> {
  type: AgencyClientEventEnum;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: EventDataType;
  sequence_id: number;
}
