import {AgencyAggregateIdInterface} from '.';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyAggregateCommandInterface extends AggregateCommandInterface {
  aggregateId: AgencyAggregateIdInterface;
  data: AgencyCommandDataType;
}
