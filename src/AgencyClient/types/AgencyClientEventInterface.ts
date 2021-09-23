import {AggregateEventInterface} from '../../EventRepository';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {AgencyClientEventEnum} from './AgencyClientEventEnum';
import {AgencyClientAggregateIdInterface} from './AgencyClientAggregateIdInterface';

export interface AgencyClientEventInterface extends AggregateEventInterface {
  type: AgencyClientEventEnum;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: GenericObjectInterface;
  sequence_id: number;
}
