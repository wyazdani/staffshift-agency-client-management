import {AgencyClientAggregateIdInterface} from '../../../AgencyClient/types';
import {EventsEnum} from '../../../Events';

export interface EventInterface<EventDataType> {
  type: EventsEnum;
  sequence_id: number;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: EventDataType;
}
