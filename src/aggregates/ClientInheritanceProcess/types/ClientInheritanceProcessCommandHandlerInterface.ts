import {ClientInheritanceProcessCommandInterface} from '.';

export interface ClientInheritanceProcessCommandHandlerInterface {
  commandType: string;
  execute(command: ClientInheritanceProcessCommandInterface): Promise<void>;
}
