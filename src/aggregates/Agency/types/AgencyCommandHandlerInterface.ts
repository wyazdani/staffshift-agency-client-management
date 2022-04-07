import {AgencyAggregateCommandInterface} from '.';

export interface AgencyCommandHandlerInterface {
  commandType: string;
  execute(command: AgencyAggregateCommandInterface): Promise<void>;
}
