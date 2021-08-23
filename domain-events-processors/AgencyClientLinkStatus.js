'use strict';
const {FacadeClientHelper} = require('../helpers/FacadeClientHelper');
const {AgencyClientRepository} = require('../src/AgencyClient/AgencyClientRepository');
const {AgencyClientCommandHandler} = require('../src/AgencyClient/AgencyClientCommandHandler');
const {EventStore} = require('../models');

class AgencyClientLinkStatus {

  constructor(logger) {
    this._logger = logger;
  }

  /**
   * Will apply the Triage Domain Event to the related aggregate
   *
   * @param {Object} message  - The PubSub Triage Domain Event Message
   */
  async apply(message) {
    console.log(message.event.name);

    let conversionData = await this.convertTriageEventToCommand(message.event.name, message.event_data);
    let repository = new AgencyClientRepository(EventStore);
    let handler = new AgencyClientCommandHandler(repository);
    return handler.apply(conversionData.agency_id, conversionData.client_id, conversionData.command);
  }

  /**
   * Convert the Triage Events into Commands
   * In the future similar commands will be issued to this services API directly
   *
   * @param {String} eventName - The Triage event name that needs to be converted
   * @param {Object} data - The Triage event data that needs to be converted
   */
  async convertTriageEventToCommand(eventName, data) {
    let conversionData = {};
    conversionData.agency_id = data.agency_id;

    // Need to have a try catch to wrap all the awaits
    try {
      // if (eventName == 'agency_organisation_site_link_created') {
      //   const isLinked = await _isLinked(this._logger, data);
      //   conversionData.command = {
      //     type: 'addAgencyClient', data: {linked: isLinked, client_type: 'site'}
      //   };
      //   conversionData.client_id = data.site_id;
      //   return conversionData;
      // }

      // if (eventName == 'agency_organisation_site_ward_link_created') {
      //   const isLinked = await _isLinked(this._logger, data);
      //   conversionData.command = {
      //     type: 'addAgencyClient', data: {linked: isLinked, client_type: 'ward'}
      //   };
      //   conversionData.client_id = data.ward_id;
      //   return conversionData;
      // }

      if (eventName == 'agency_organisation_site_link_deleted') {
        conversionData.command = {type: 'unlinkAgencyClient'};
        conversionData.client_id = data.site_id;
        return conversionData;
      }

      // Handle the Ward Delete
      if (eventName == 'agency_organisation_site_ward_link_deleted') {
        conversionData.command = {type: 'unlinkAgencyClient'};
        conversionData.client_id = data.ward_id;
        return conversionData;
      }

      // It changed lets figure out if is a link or unlink
      if (eventName == 'agency_organisation_site_link_status_changed' || eventName == 'agency_organisation_site_link_created') {
        const command = await _getCommand(this._logger, data);
        conversionData.command = {type: command, data: {client_type: 'site'}};
        conversionData.client_id = data.site_id;
      }

      // It changed lets figure out if is a link or unlink
      if (eventName == 'agency_organisation_site_ward_link_status_changed' || eventName == 'agency_organisation_site_ward_link_created') {
        const command = await _getCommand(this._logger, data);
        conversionData.command = {type: command, data: {client_type: 'ward'}};
        conversionData.client_id = data.ward_id;
      }

      return conversionData;
    } catch (err) {
      this._logger.error('Error while converting the Triage Domain Event into a Command', err);
      throw err;
    }
  }
}

/**
 * Uses the Triage Domain Event Data to determine the appropriate command
 * Makes a call to the staffshift-facade service as the event does not have all the required data for the decision
 *
 * @param {Object} logger - The logger object
 * @param {Object} data - The Triage Domain Event data that should be used for the command
 *
 * @returns {String} - The command that should be applied
 */
async function _getCommand(logger, data) {
  const client = new FacadeClientHelper(logger);
  // Need try catch
  let response = await client.getAgencyClientDetails(data.agency_id, data.organisation_id, data.site_id, data.ward_id);
  if (response.length > 1) {
    throw new Error('We are only expecting a single agency client entry to be returned');
  }
  // Default to unlinked, we only need to now assert if a response was returned
  let command = 'unlinkAgencyClient';
    if (response) {
      command = (response[0].agency_linked) ? 'linkAgencyClient' : 'unlinkAgencyClient';
  }
  return command
}

/**
 * Uses the Triage Domain Event Data to determine the appropriate command
 * Makes a call to the staffshift-facade service as the event does not have all the required data for the decision
 *
 * @param {Object} logger - The logger object
 * @param {Object} data - The Triage Domain Event data that should be used for the command
 *
 * @returns {String} - The command that should be applied
 */
async function _isLinked(logger, data) {
  const client = new FacadeClientHelper(logger);
  // Need try catch
  let response = await client.getAgencyClientDetails(data.agency_id, data.organisation_id, data.site_id, data.ward_id);
  if (response.length > 1) {
    throw new Error('We are only expecting a single agency client entry to be returned');
  }
  if (response) {
    return response[0].agency_linked;
  }
  return false;
}

module.exports = {AgencyClientLinkStatus};