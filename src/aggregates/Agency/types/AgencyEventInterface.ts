import {AgencyAggregateIdInterface} from './AgencyAggregateIdInterface';
import {EventsEnum} from '../../../Events';
import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyEventInterface {
  type: EventsEnum;
  aggregate_id: AgencyAggregateIdInterface;
  data: AgencyCommandDataType;
  sequence_id: number;
}
