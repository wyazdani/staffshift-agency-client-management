import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientAggregateIdInterface} from '../../../aggregates/AgencyClient/types';
import {EventRepository} from '../../../EventRepository';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {AgencyClientSyncedEventStoreDataInterface} from 'EventTypes';
import {FinancialHoldAgencyClientLinkPropagator} from './FinancialHoldAgencyClientLinkPropagator';

export class AgencyClientSyncedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientSyncedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext, private eventRepository: EventRepository) {}

  async handle(event: EventStoreModelInterface<AgencyClientSyncedEventStoreDataInterface>): Promise<void> {
    if (!event.data.linked) {
      this.logger.debug('sync event was related to an unlinked client. ignoring the message');
      return;
    }
    const propagator = new FinancialHoldAgencyClientLinkPropagator(this.logger, this.eventRepository);

    await propagator.propagate(event.aggregate_id as AgencyClientAggregateIdInterface, event.data);
  }
}
