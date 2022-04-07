import {EventRepository} from '../EventRepository';

declare class _AggregateCommandBusInterface {
  static getCommandBus(eventRespository: EventRepository): void;
}

export type AggregateCommandBusType = typeof _AggregateCommandBusInterface;
