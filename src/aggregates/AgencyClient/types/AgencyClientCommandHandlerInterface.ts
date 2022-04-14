import {AgencyClientCommandInterface} from './AgencyClientCommandInterface';
export interface AgencyClientCommandHandlerInterface {
  commandType: string;
  execute(command: AgencyClientCommandInterface): Promise<void>;
}
