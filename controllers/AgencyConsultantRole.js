'use strict';
const {AgencyRepository} = require('../src/Agency/AgencyRepository');
const {AgencyCommandHandler} = require('../src/Agency/AgencyCommandHandler');
const {get} = require('lodash');
const {EventStore} = require('../models');
const {ResourceNotFoundError} = require('a24-node-error-utils');

/**
 * Add Agency Consultant Role
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.addAgencyConsultantRole = async (req, res, next) => {
  const payload = get(req, 'swagger.params.agency_consultant_role_payload.value', {});
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyRepository(EventStore);
  let handler = new AgencyCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: payload
  };

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

/**
 * Update the details of a Agency Consultant Role
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.updateAgencyConsultantRole = async (req, res, next) => {
  const payload = get(req, 'swagger.params.agency_consultant_role_update_payload.value', {});
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyRepository(EventStore);
  let handler = new AgencyCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: {...payload, _id: consultantRoleId}
  };

  try {
    // Passing in the agency id here feels strange
    await handler.apply(agencyId, command);
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
 * Changes the status of the Agency Consultant Role
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.changeStatusAgencyConsultantRole = async (req, res, next) => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyRepository(EventStore);
  let handler = new AgencyCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: {_id: consultantRoleId}
  };

  try {
    // Passing in the agency id here feels strange
    await handler.apply(agencyId, command);
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
 * Get Agency Consultant Role
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.getAgencyConsultantRole = async (req, res, next) => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');

  // Consider using a builder | respository pattern
  let repository = new AgencyRepository(EventStore);

  try {
    // This will most likely need to project only the section we are working with based on the route
    let aggregate = await repository.getAggregate(agencyId);
    let consultantRole = aggregate.getConsultantRole(consultantRoleId);

    // This needs to be centralised and done better
    if (consultantRole) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(consultantRole));
      return;
    }
    return next (new ResourceNotFoundError(`No agency consultant role found for agency: ${agencyId} and consultant: ${consultantRoleId}`));
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

/**
 * Get Agency Consultant Role
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.listAgencyConsultantRoles = async (req, res, next) => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');

  // Consider using a builder | respository pattern
  let repository = new AgencyRepository(EventStore);

  try {
    // This will most likely need to project only the section we are working with based on the route
    let aggregate = await repository.getAggregate(agencyId);
    let consultantRoles = aggregate.getConsultantRoles();

    // This needs to be centralised and done better
    if (consultantRoles && consultantRoles.length > 0) {
      res.statusCode = 200;
      res.setHeader('x-result-count', consultantRoles.length);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(consultantRoles));
      return;
    }
    res.statusCode = 204;
    res.end();
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

// NEW GENERATOR FUNCTIONS LOCATION