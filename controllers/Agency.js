'use strict';
const {AgencyRepository} = require('../src/Agency/AgencyRepository');
const {AgencyCommandHandler} = require('../src/Agency/AgencyCommandHandler');
const {get} = require('lodash');
const {EventStore} = require('../models');

/**
 * Gets the status of the service
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.addAgencyConsultantRole = async (req, res, next) => {
  const payload = get(req, 'swagger.params.add_agency_consultant_role_payload.value', {});
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyRepository(EventStore);
  let handler = new AgencyCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: payload
  }

  try {
    // Passing in the agency id here feels strange
    await handler.apply(agency_id, command);
    // This needs to be centralised and done better
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: 'completed'}));
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

// NEW GENERATOR FUNCTIONS LOCATION