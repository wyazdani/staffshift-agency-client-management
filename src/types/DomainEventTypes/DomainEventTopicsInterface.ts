import {DomainEventSubscriberInterface} from 'DomainEventTypes/DomainEventSubscriberInterface';

export interface DomainEventTopicsInterface {
  name: string;
  subscribers: DomainEventSubscriberInterface[];
}
