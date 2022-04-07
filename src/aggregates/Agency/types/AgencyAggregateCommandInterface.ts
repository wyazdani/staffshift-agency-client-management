import {AgencyAggregateIdInterface} from '.';
import {AggregateCommandInterface} from '../../AggregateCommandInterface';
import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyAggregateCommandInterface extends AggregateCommandInterface {
  aggregateId: AgencyAggregateIdInterface;
  data: AgencyCommandDataType;
}
