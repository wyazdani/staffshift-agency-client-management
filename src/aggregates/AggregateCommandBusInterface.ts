import {EventRepository} from '../EventRepository';
import {AggregateCommandInterface} from './AggregateCommandInterface';

export interface AggregateCommandBusInterface {
  run(command: AggregateCommandInterface): Promise<void>;
}
