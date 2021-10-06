import {AggregateEventInterface} from '../../EventRepository';
import {AgencyEventEnum} from './AgencyEventEnum';
import {AgencyAggregateIdInterface} from './AgencyAggregateIdInterface';
import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyEventInterface extends AggregateEventInterface {
  type: AgencyEventEnum;
  aggregate_id: AgencyAggregateIdInterface;
  data: AgencyCommandDataType;
  sequence_id: number;
}
