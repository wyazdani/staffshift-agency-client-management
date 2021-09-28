import {AgencyClientCommandDataType} from './AgencyClientCommandDataType';

export interface AgencyClientCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, clientId: string, commandData: AgencyClientCommandDataType): Promise<void>;
}
