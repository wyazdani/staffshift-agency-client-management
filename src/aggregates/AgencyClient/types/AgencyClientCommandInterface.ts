import {AgencyClientAggregateIdInterface, AgencyClientCommandEnum} from '.';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {AgencyClientCommandDataType} from './AgencyClientCommandDataType';

export interface AgencyClientCommandInterface extends AggregateCommandInterface {
  aggregateId: AgencyClientAggregateIdInterface;
  type: AgencyClientCommandEnum;
  data: AgencyClientCommandDataType;
}
