export interface DomainEventSubscriberInterface {
  name: string;
  processor: string;
  maxPullMessages?: number;
  maxConcurrentMessages?: number;
}

export interface DomainEventTopicsInterface {
  name: string;
  subscribers: DomainEventSubscriberInterface[];
}

export interface DomainEventConfigurationInterface {
  app: string;
  jwt_secret: string;
  pod_id: number;
  strict_mode: boolean;
  ss_domain_event_topics: DomainEventTopicsInterface[];
}
