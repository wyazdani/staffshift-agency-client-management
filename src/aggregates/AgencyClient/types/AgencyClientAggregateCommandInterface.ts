import {AgencyClientAggregateIdInterface} from '.';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {AgencyClientCommandDataType} from './AgencyClientCommandDataType';

export interface AgencyClientAggregateCommandInterface extends AggregateCommandInterface {
  aggregateId: AgencyClientAggregateIdInterface;
  data: AgencyClientCommandDataType;
}
