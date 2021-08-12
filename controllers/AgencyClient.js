'use strict';
const AgencyClient = require('../src/AgencyClient/AgencyClient');
const {get} = require('lodash');
const {EventStore} = require('../models');

/**
 * Gets the status of the service
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.addClientConsultant = async (req, res, next) => {
  const payload = get(req, 'swagger.params.assign_client_consultant_payload.value', {});
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: payload
  }
  // Consider using a builder | respository pattern
  let agg = new AgencyClient(agency_id, client_id);

  // Should this be part of the aggregate already?
  agg.setEventStore(EventStore);

  try {
    await agg.apply(command)
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

/**
 * Gets the status of the service
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
 module.exports.removeClientConsultant = async (req, res, next) => {
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');
  const consultant_id = get(req, 'swagger.params.consultant_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: {_id: consultant_id}
  }
  // Consider using a builder | respository pattern
  let agg = new AgencyClient(agency_id, client_id);

  // Should this be part of the aggregate already?
  agg.setEventStore(EventStore);

  try {
    await agg.apply(command)
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

/**
 * Gets the status of the service
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
 module.exports.getClient = async (req, res, next) => {
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');

  // Consider using a builder | respository pattern
  let agg = new AgencyClient(agency_id, client_id);

  // Should this be part of the aggregate already?
  agg.setEventStore(EventStore);

  try {
    let data = await agg.project()
    // This needs to be centralised and done better
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

// NEW GENERATOR FUNCTIONS LOCATION