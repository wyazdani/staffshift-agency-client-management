import {LoggerContext} from 'a24-logzio-winston';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientRepository} from '../../../aggregates/AgencyClient/AgencyClientRepository';
import {AgencyClientWriteProjectionHandler} from '../../../aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {AgencyClientAggregateIdInterface} from '../../../aggregates/AgencyClient/types';
import {CommandBus} from '../../../aggregates/CommandBus';
import {PaymentTermRepository} from '../../../aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermWriteProjectionHandler} from '../../../aggregates/PaymentTerm/PaymentTermWriteProjectionHandler';
import {PaymentTermCommandEnum} from '../../../aggregates/PaymentTerm/types';
import {ApplyInheritedPaymentTermCommandInterface} from '../../../aggregates/PaymentTerm/types/CommandTypes';
import {EventRepository} from '../../../EventRepository';

/**
 * receives the event for agency client linked or synced and then do the following:
 * - if client type is organisation;
 *   - ignore the message since we don't need to apply any payment term. user can set the payment term on screens
 * - if client type is site
 *   - load payment term aggregate for the organisation
 *   - set the same payment term as the org
 * - if client type is ward
 *   - load payment term aggregate for site
 *   - load agency client aggregate for site
 *   - check if site is linked after payment term events(or site payment term aggregate is empty) (or site is not linked: it should not happen, if it happens something is going wrong in the system)?
 *     - if yes, it means the value on the payment term is not valid anymore
 *        (maybe the linked event is not received for the site yet to reflect the changes from organisation)
 *        - we need to load org payment term and then apply it on the ward
 *     - if no, we can set site's payment term on the ward
 *
 *
 * Note: why we might get linked event of ward first and then site afterwards?
 *  - because it's in different aggregates within AgencyClient aggregate type we might get them out of sequence
 */
export class PaymentTermAgencyClientLinkPropagator {
  constructor(private logger: LoggerContext, private eventRepository: EventRepository) {}

  async propagate(
    aggregateId: AgencyClientAggregateIdInterface,
    payload: {
      client_type: string;
      organisation_id?: string;
      site_id?: string;
    }
  ): Promise<void> {
    if (payload.client_type === 'organisation') {
      this.logger.info('client type is organisation. nothing need to be done');
      return;
    }
    const agencyId = aggregateId.agency_id;
    const clientId = aggregateId.client_id;
    const paymentTermRepository = new PaymentTermRepository(
      this.eventRepository,
      new PaymentTermWriteProjectionHandler()
    );
    const commandBus = new CommandBus(this.eventRepository);

    if (payload.client_type === 'site') {
      // load parent's payment term and then apply on the node
      const parentAggregate = await paymentTermRepository.getAggregate({
        name: 'payment_term',
        agency_id: agencyId,
        client_id: payload.organisation_id
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
          force: true // we force it since we want to inherit from parent event even it was not inherited before
        }
      } as ApplyInheritedPaymentTermCommandInterface);
    } else {
      // Type is ward, now we need to load parent, check agency client aggregate
      // check if last linked event is after parent payment term? if yes fine
      // otherwise load parent's parent

      // load parent's payment term
      const sitePaymentTerm = await paymentTermRepository.getAggregate({
        name: 'payment_term',
        agency_id: agencyId,
        client_id: payload.site_id
      });
      const agencyClientRepository = new AgencyClientRepository(
        this.eventRepository,
        new AgencyClientWriteProjectionHandler(),
        new AgencyRepository(this.eventRepository, new AgencyWriteProjectionHandler())
      );
      const siteAgencyClient = await agencyClientRepository.getAggregate({
        agency_id: agencyId,
        client_id: payload.site_id
      });

      /**
       * scenarios:
       * - site pay term event is after agency client event => load from org aggregate
       * - site payment term aggregate is empty => load from org aggregate
       * - otherwise load from site aggregate
       */
      if (
        siteAgencyClient.getLinkedDate() > sitePaymentTerm.getLastEventDate() ||
        sitePaymentTerm.getLastEventDate() === null ||
        siteAgencyClient.getLinkedDate() === null
      ) {
        // we now need to go to organisation payment term
        const orgPaymentTerm = await paymentTermRepository.getAggregate({
          name: 'payment_term',
          agency_id: agencyId,
          client_id: payload.organisation_id
        });

        await commandBus.execute({
          aggregateId: {
            name: 'payment_term',
            agency_id: agencyId,
            client_id: clientId
          },
          type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
          data: {
            term: orgPaymentTerm.getPaymentTerm(),
            force: true
          }
        } as ApplyInheritedPaymentTermCommandInterface);
      } else {
        await commandBus.execute({
          aggregateId: {
            name: 'payment_term',
            agency_id: agencyId,
            client_id: clientId
          },
          type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
          data: {
            term: sitePaymentTerm.getPaymentTerm(),
            force: true
          }
        } as ApplyInheritedPaymentTermCommandInterface);
      }
    }
  }
}
