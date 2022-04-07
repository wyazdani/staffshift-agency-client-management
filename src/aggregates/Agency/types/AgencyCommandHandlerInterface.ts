import {AggregateCommandHandlerInterface} from '../../../../src/aggregates/types';
import {AgencyAggregateCommandInterface} from '.';

export interface AgencyCommandHandlerInterface extends AggregateCommandHandlerInterface {
  execute(command: AgencyAggregateCommandInterface): Promise<void>;
}
