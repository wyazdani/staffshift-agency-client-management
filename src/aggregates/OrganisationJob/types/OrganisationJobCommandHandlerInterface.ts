import {OrganisationJobCommandInterface} from './OrganisationJobCommandInterface';

export interface OrganisationJobCommandHandlerInterface {
  commandType: string;
  execute(command: OrganisationJobCommandInterface): Promise<void>;
}
