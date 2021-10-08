import {AgencyClientAggregateIdInterface} from './AgencyClientAggregateIdInterface';
import {EventsEnum} from '../../Events';

export interface AgencyClientEventInterface<EventDataType> {
  type: EventsEnum;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: EventDataType;
  sequence_id: number;
}
