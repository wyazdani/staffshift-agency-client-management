export interface DomainEventSubscriberInterface {
  name: string;
  processor: string;
  maxPullMessages?: number;
  maxConcurrentMessages?: number;
}
