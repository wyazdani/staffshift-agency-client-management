import {AgencyAggregateIdInterface} from '.';
import {AggregateCommandInterface} from '../../AggregateCommandInterface';

export interface AgencyAggregateCommandInterface extends AggregateCommandInterface {
  aggregateId: AgencyAggregateIdInterface;
}
