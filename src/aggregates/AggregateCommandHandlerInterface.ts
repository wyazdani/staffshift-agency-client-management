import {AggregateCommandInterface} from './AggregateCommandInterface';

export interface AggregateCommandHandlerInterface {
  commandType: string;
  execute(commandData: AggregateCommandInterface): Promise<void>;
}
