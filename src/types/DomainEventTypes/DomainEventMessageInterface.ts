export interface DomainEventMessageInterface<PubSubEventData> {
  event: {
    name: string;
    id: string;
    date_created: Date;
  };
  application_jwt: string;
  event_data: PubSubEventData;
}
