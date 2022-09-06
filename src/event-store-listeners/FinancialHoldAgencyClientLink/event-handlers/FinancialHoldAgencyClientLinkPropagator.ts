import {LoggerContext} from 'a24-logzio-winston';
import {FinancialHoldRepository} from '../../../aggregates/FinancialHold/FinancialHoldRepository';
import {FinancialHoldWriteProjectionHandler} from '../../../aggregates/FinancialHold/FinancialHoldWriteProjectionHandler';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientRepository} from '../../../aggregates/AgencyClient/AgencyClientRepository';
import {AgencyClientWriteProjectionHandler} from '../../../aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {AgencyClientAggregateIdInterface} from '../../../aggregates/AgencyClient/types';
import {CommandBus} from '../../../aggregates/CommandBus';
import {EventRepository} from '../../../EventRepository';
import {InheritFinancialHoldClientLinkCommandInterface} from '../../../aggregates/FinancialHold/types/CommandTypes';
import {FinancialHoldCommandEnum} from '../../../aggregates/FinancialHold/types';

/**
 * receives the event for agency client linked or synced and then do the following:
 * - if client type is organisation;
 *   - ignore the message since we don't need to apply any financial hold. user can set the financial hold on screens
 * - if client type is site
 *   - load financial hold aggregate for the organisation
 *   - set the same financial hold as the org also set note
 * - if client type is ward
 *   - load financial hold aggregate for site
 *   - load agency client aggregate for site
 *   - check if site is linked after financial hold events(or site financial hold aggregate is empty) (or site is not linked: it should not happen, if it happens something is going wrong in the system)?
 *     - if yes, it means the value on the financial hold is not valid anymore
 *        (maybe the linked event is not received for the site yet to reflect the changes from organisation)
 *        - we need to load org financial hold and then apply it on the ward
 *     - if no, we can set site's financial hold on the ward
 *
 *
 * Note: why we might get linked event of ward first and then site afterwards?
 *  - because it's in different aggregates within AgencyClient aggregate type we might get them out of sequence
 */
export class FinancialHoldAgencyClientLinkPropagator {
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
    const financialHoldRepository = new FinancialHoldRepository(
      this.eventRepository,
      new FinancialHoldWriteProjectionHandler()
    );
    const commandBus = new CommandBus(this.eventRepository);

    if (payload.client_type === 'site') {
      // load parent's financial hold and then apply on the node
      const parentAggregate = await financialHoldRepository.getAggregate({
        name: 'financial_hold',
        agency_id: agencyId,
        client_id: payload.organisation_id
      });

      await commandBus.execute({
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: parentAggregate.getFinancialHold(),
          note: parentAggregate.getNote()
        }
      } as InheritFinancialHoldClientLinkCommandInterface);
    } else {
      // Type is ward, now we need to load parent, check agency client aggregate
      // check if last linked event is after parent financial hold? if yes fine
      // otherwise load parent's parent

      // load parent's financial hold
      const siteFinancialHold = await financialHoldRepository.getAggregate({
        name: 'financial_hold',
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
       * - site financial hold event is after agency client event => load from org aggregate
       * - site financial hold aggregate is empty => load from org aggregate
       * - otherwise load from site aggregate
       */
      if (
        siteAgencyClient.getLinkedDate() > siteFinancialHold.getLastEventDate() ||
        siteFinancialHold.getLastEventDate() === null ||
        siteAgencyClient.getLinkedDate() === null
      ) {
        // we now need to go to organisation financial hold
        const orgFinancialHold = await financialHoldRepository.getAggregate({
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: payload.organisation_id
        });

        await commandBus.execute({
          aggregateId: {
            name: 'financial_hold',
            agency_id: agencyId,
            client_id: clientId
          },
          type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
          data: {
            financial_hold: orgFinancialHold.getFinancialHold(),
            note: orgFinancialHold.getNote()
          }
        } as InheritFinancialHoldClientLinkCommandInterface);
      } else {
        await commandBus.execute({
          aggregateId: {
            name: 'financial_hold',
            agency_id: agencyId,
            client_id: clientId
          },
          type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
          data: {
            financial_hold: siteFinancialHold.getFinancialHold(),
            note: siteFinancialHold.getNote()
          }
        } as InheritFinancialHoldClientLinkCommandInterface);
      }
    }
  }
}
