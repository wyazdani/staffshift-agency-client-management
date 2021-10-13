import {DomainEventTopicsInterface} from 'DomainEventTypes/DomainEventTopicsInterface';

export interface DomainEventConfigurationInterface {
  app: string;
  jwt_secret: string;
  pod_id: number;
  strict_mode: boolean;
  ss_domain_event_topics: DomainEventTopicsInterface[];
}
