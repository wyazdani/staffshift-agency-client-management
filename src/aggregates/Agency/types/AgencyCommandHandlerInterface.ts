import {AggregateCommandHandlerInterface} from '../../../../src/aggregates/types';
import {AgencyCommandInterface} from '.';

export interface AgencyCommandHandlerInterface extends AggregateCommandHandlerInterface {
  execute(command: AgencyCommandInterface): Promise<void>;
}
