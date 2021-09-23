import {AggregateEventInterface} from '../../EventRepository';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {AgencyEventEnum} from './AgencyEventEnum';
import {AgencyAggregateIdInterface} from './AgencyAggregateIdInterface';

export interface AgencyEventInterface extends AggregateEventInterface {
  type: AgencyEventEnum;
  aggregate_id: AgencyAggregateIdInterface;
  data: GenericObjectInterface;
  sequence_id: number;
}
