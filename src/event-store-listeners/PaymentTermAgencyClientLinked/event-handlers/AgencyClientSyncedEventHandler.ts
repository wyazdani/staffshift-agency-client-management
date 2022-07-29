import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {CommandBus} from '../../../aggregates/CommandBus';
import {PaymentTermRepository} from '../../../aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermWriteProjectionHandler} from '../../../aggregates/PaymentTerm/PaymentTermWriteProjectionHandler';
import {PaymentTermCommandEnum} from '../../../aggregates/PaymentTerm/types';
import {ApplyInheritedPaymentTermCommandInterface} from '../../../aggregates/PaymentTerm/types/CommandTypes';
import {EventRepository} from '../../../EventRepository';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {AgencyClientSyncedEventStoreDataInterface} from 'EventTypes';

export class AgencyClientSyncedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientSyncedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext, private eventRepository: EventRepository) {}

  async handle(event: EventStoreModelInterface<AgencyClientSyncedEventStoreDataInterface>): Promise<void> {
    if (!event.data.linked) {
      this.logger.debug('sync event was related to an unlinked client. ignoring the message');
      return;
    }
    if (event.data.client_type === 'organisation') {
      this.logger.info('client type is organisation. nothing need to be done');
      return;
    }
    const agencyId = event.aggregate_id.agency_id;
    const clientId = event.aggregate_id.client_id;
    const paymentTermRepository = new PaymentTermRepository(
      this.eventRepository,
      new PaymentTermWriteProjectionHandler()
    );
    const commandBus = new CommandBus(this.eventRepository);

    if (event.data.client_type === 'site') {
      // load parent's payment term and then apply on the node
      const parentAggregate = await paymentTermRepository.getAggregate({
        name: 'payment_term',
        agency_id: agencyId,
        client_id: event.data.organisation_id
      });
      const parentPaymentTerm = parentAggregate.getPaymentTerm();

      await commandBus.execute({
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: parentPaymentTerm,
          force: true
        }
      } as ApplyInheritedPaymentTermCommandInterface);
    } else {
      // type is ward, now we need to load parent, check agency client aggregate
      // check if last linked event is after parent payment term? if yes fine
      // otherwise load parent's parent
    }
  }
}
