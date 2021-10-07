import {LoggerContext} from 'a24-logzio-winston';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';
import {AgencyClientCommandBus} from '../AgencyClient/AgencyClientCommandBus';
import {RuntimeError} from 'a24-node-error-utils';
import {DomainEventMessageInterface} from 'DomainEventMessageInterface';
import {AgencyClientLinkDomainEventDataInterface} from 'AgencyClientLinkDomainEventDataInterface';
import {AgencyClientCommandEnum, AgencyClientCommandInterface} from '../AgencyClient/types';

interface TriageEventToCommandInterface {
  agency_id: string;
  client_id: string;
  command: AgencyClientCommandInterface;
}

/**
 * Responsible for handling triage domain events and trigger the relevant commands
 * based off the event.
 */
export class AgencyClientLinkStatus {
  constructor(
    private logger: LoggerContext,
    private agencyClientCommandBus: AgencyClientCommandBus,
    private facadeClientHelper: FacadeClientHelper
  ) {}

  /**
   * Will apply the Triage Domain Event to the related aggregate
   *
   * @param {Object} message  - The PubSub Triage Domain Event Message
   */
  public async apply(message: DomainEventMessageInterface<AgencyClientLinkDomainEventDataInterface>): Promise<void> {
    const conversionData = await this.convertTriageEventToCommand(message.event.name, message.event_data);

    return this.agencyClientCommandBus.execute(
      conversionData.agency_id,
      conversionData.client_id,
      conversionData.command
    );
  }

  /**
   * Convert the Triage EventsEnum into Commands
   * In the future similar commands will be issued to this services API directly
   *
   * @param {String} eventName - The Triage event name that needs to be converted
   * @param {Object} data - The Triage event data that needs to be converted
   */
  private async convertTriageEventToCommand(
    eventName: string,
    data: AgencyClientLinkDomainEventDataInterface
  ): Promise<TriageEventToCommandInterface> {
    try {
      // Handle the Organisation Delete
      if (eventName == 'agency_organisation_link_deleted') {
        return {
          command: {
            type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT,
            data: {client_type: 'organisation'}
          },
          agency_id: data.agency_id,
          client_id: data.organisation_id
        };
      }

      // Handle the Site Delete
      if (eventName == 'agency_organisation_site_link_deleted') {
        return {
          command: {
            type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT,
            data: {organisation_id: data.organisation_id, client_type: 'site'}
          },
          agency_id: data.agency_id,
          client_id: data.site_id
        };
      }

      // Handle the Ward Delete
      if (eventName == 'agency_organisation_site_ward_link_deleted') {
        return {
          command: {
            type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT,
            data: {organisation_id: data.organisation_id, site_id: data.site_id, client_type: 'ward'}
          },
          agency_id: data.agency_id,
          client_id: data.ward_id
        };
      }

      // It changed lets figure out if is a link or unlink
      if (eventName == 'agency_organisation_link_status_changed' || eventName == 'agency_organisation_link_created') {
        const commandType = await this.getCommandType(data);

        return {
          command: {
            type: commandType,
            data: {client_type: 'organisation'}
          },
          agency_id: data.agency_id,
          client_id: data.organisation_id
        };
      }

      // It changed lets figure out if is a link or unlink
      if (
        eventName == 'agency_organisation_site_link_status_changed' ||
        eventName == 'agency_organisation_site_link_created'
      ) {
        const commandType = await this.getCommandType(data);

        return {
          command: {
            type: commandType,
            data: {organisation_id: data.organisation_id, client_type: 'site'}
          },
          agency_id: data.agency_id,
          client_id: data.site_id
        };
      }

      // It changed lets figure out if is a link or unlink
      if (
        eventName == 'agency_organisation_site_ward_link_status_changed' ||
        eventName == 'agency_organisation_site_ward_link_created'
      ) {
        const commandType = await this.getCommandType(data);

        return {
          command: {
            type: commandType,
            data: {organisation_id: data.organisation_id, site_id: data.site_id, client_type: 'ward'}
          },
          agency_id: data.agency_id,
          client_id: data.ward_id
        };
      }
    } catch (err) {
      this.logger.error('Error while converting the Triage Domain Event into a Command', err);
      throw err;
    }
  }

  /**
   * Uses the Triage Domain Event Data to determine the appropriate command
   * Makes a call to the staffshift-facade service as the event does not have all the required data for the decision
   *
   * @param {Object} data - The Triage Domain Event data that should be used for the command
   *
   * @returns {String} - The command that should be applied
   */
  private async getCommandType(data: AgencyClientLinkDomainEventDataInterface): Promise<AgencyClientCommandEnum> {
    const response = await this.facadeClientHelper.getAgencyClientDetails(
      data.agency_id,
      data.organisation_id,
      data.site_id,
      data.ward_id
    );

    if (response && response.length > 1) {
      throw new RuntimeError('We are only expecting a single agency client entry to be returned');
    }
    // Default to unlinked, we only need to now assert if a response was returned
    let commandType = AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;

    if (response) {
      commandType = response[0].agency_linked
        ? AgencyClientCommandEnum.LINK_AGENCY_CLIENT
        : AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;
    }

    return commandType;
  }
}
