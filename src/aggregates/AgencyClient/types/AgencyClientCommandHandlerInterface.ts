import {AgencyClientAggregateCommandInterface} from './AgencyClientAggregateCommandInterface';
export interface AgencyClientCommandHandlerInterface {
  commandType: string;
  execute(command: AgencyClientAggregateCommandInterface): Promise<void>;
}
