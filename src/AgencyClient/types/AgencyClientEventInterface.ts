import {AggregateEventInterface} from '../../EventRepository';
import {AgencyClientEventEnum} from './AgencyClientEventEnum';
import {AgencyClientAggregateIdInterface} from './AgencyClientAggregateIdInterface';
import {AgencyClientCommandDataType} from './AgencyClientCommandDataType';

export interface AgencyClientEventInterface extends AggregateEventInterface {
  type: AgencyClientEventEnum;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: AgencyClientCommandDataType;
  sequence_id: number;
}
