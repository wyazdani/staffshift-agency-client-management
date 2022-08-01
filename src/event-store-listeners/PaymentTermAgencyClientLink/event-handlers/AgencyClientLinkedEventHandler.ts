import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientAggregateIdInterface} from '../../../aggregates/AgencyClient/types';
import {EventRepository} from '../../../EventRepository';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {AgencyClientLinkedEventStoreDataInterface} from 'EventTypes';
import {PaymentTermAgencyClientLinkPropagator} from './PaymentTermAgencyClientLinkPropagator';

export class AgencyClientLinkedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientLinkedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext, private eventRepository: EventRepository) {}

  async handle(event: EventStoreModelInterface<AgencyClientLinkedEventStoreDataInterface>): Promise<void> {
    const propagator = new PaymentTermAgencyClientLinkPropagator(this.logger, this.eventRepository);

    await propagator.propagate(event.aggregate_id as AgencyClientAggregateIdInterface, event.data);
  }
}
