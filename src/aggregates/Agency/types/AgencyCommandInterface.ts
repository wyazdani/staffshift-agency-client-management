import {AgencyAggregateIdInterface, AgencyCommandEnum} from '.';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyCommandInterface extends AggregateCommandInterface {
  aggregateId: AgencyAggregateIdInterface;
  type: AgencyCommandEnum;
  data: AgencyCommandDataType;
}
