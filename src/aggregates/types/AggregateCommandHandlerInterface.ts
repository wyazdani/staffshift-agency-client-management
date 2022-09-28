import {AggregateCommandInterface} from './AggregateCommandInterface';

export interface AggregateCommandHandlerInterface {
  commandType: string;
  execute(command: AggregateCommandInterface): Promise<number>;
}
