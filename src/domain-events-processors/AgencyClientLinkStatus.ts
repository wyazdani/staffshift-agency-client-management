import {LoggerContext} from 'a24-logzio-winston';
import {AgencyClientRepository} from '../AgencyClient/AgencyClientRepository';
import {EventStore} from '../models/EventStore';
import {AgencyClientCommandHandler} from '../AgencyClient/AgencyClientCommandHandler';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';

export class AgencyClientLinkStatus {
  constructor(private logger: LoggerContext) {
  }

  /**
   * Will apply the Triage Domain Event to the related aggregate
   *
   * @param {Object} message  - The PubSub Triage Domain Event Message
   */
  public async apply(message: any): Promise<any> {
    // try catch to handle the await error
    const conversionData = await this.convertTriageEventToCommand(message.event.name, message.event_data);
    const repository = new AgencyClientRepository(EventStore);
    const handler = new AgencyClientCommandHandler(repository);
    return handler.apply(conversionData.agency_id, conversionData.client_id, conversionData.command);
  }

  /**
   * Convert the Triage Events into Commands
   * In the future similar commands will be issued to this services API directly
   *
   * @param {String} eventName - The Triage event name that needs to be converted
   * @param {Object} data - The Triage event data that needs to be converted
   */
  private async convertTriageEventToCommand(eventName: string, data: any) {
    const conversionData: {[key: string]: any} = {};
    conversionData.agency_id = data.agency_id;

    // Need to have a try catch to wrap all the awaits
    try {
      // Handle the Organisation Delete
      if (eventName == 'agency_organisation_link_deleted') {
        conversionData.command = {type: 'unlinkAgencyClient', data: {client_type: 'organisation'}};
        conversionData.client_id = data.organisation_id;
        return conversionData;
      }

      // Handle the Site Delete
      if (eventName == 'agency_organisation_site_link_deleted') {
        conversionData.command = {type: 'unlinkAgencyClient', data: {organisation_id: data.organisation_id, client_type: 'site'}};
        conversionData.client_id = data.site_id;
        return conversionData;
      }

      // Handle the Ward Delete
      if (eventName == 'agency_organisation_site_ward_link_deleted') {
        conversionData.command = {type: 'unlinkAgencyClient', data: {organisation_id: data.organisation_id, site_id: data.site_id, client_type: 'ward'}};
        conversionData.client_id = data.ward_id;
        return conversionData;
      }

      // It changed lets figure out if is a link or unlink
      if (eventName == 'agency_organisation_link_status_changed' || eventName == 'agency_organisation_link_created') {
        const command = await this.getCommand(data);
        conversionData.command = {type: command, data: {client_type: 'organisation'}};
        conversionData.client_id = data.organisation_id;
      }

      // It changed lets figure out if is a link or unlink
      if (eventName == 'agency_organisation_site_link_status_changed' || eventName == 'agency_organisation_site_link_created') {
        const command = await this.getCommand(data);
        conversionData.command = {type: command, data: {organisation_id: data.organisation_id, client_type: 'site'}};
        conversionData.client_id = data.site_id;
      }

      // It changed lets figure out if is a link or unlink
      if (eventName == 'agency_organisation_site_ward_link_status_changed' || eventName == 'agency_organisation_site_ward_link_created') {
        const command = await this.getCommand(data);
        conversionData.command = {type: command, data: {organisation_id: data.organisation_id, site_id: data.site_id, client_type: 'ward'}};
        conversionData.client_id = data.ward_id;
      }

      return conversionData;
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
  private async getCommand(data: any) {
    const client = new FacadeClientHelper(this.logger);
    // Need try catch
    const response = await client.getAgencyClientDetails(data.agency_id, data.organisation_id, data.site_id, data.ward_id);
    if (response && response.length > 1) {
      throw new Error('We are only expecting a single agency client entry to be returned');
    }
    // Default to unlinked, we only need to now assert if a response was returned
    let command = 'unlinkAgencyClient';
    if (response) {
      command = (response[0].agency_linked) ? 'linkAgencyClient' : 'unlinkAgencyClient';
    }
    return command;
  }
}