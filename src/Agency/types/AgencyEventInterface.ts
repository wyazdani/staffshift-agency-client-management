import {AgencyAggregateIdInterface} from './AgencyAggregateIdInterface';
import {EventsEnum} from '../../Events';

export interface AgencyEventInterface<EventDataType> {
  type: EventsEnum;
  aggregate_id: AgencyAggregateIdInterface;
  data: EventDataType;
  sequence_id: number;
}
