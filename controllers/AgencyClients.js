'use strict';
const {AgencyClientRepository} = require('../src/AgencyClient/AgencyClientRepository');
const {AgencyClientCommandHandler} = require('../src/AgencyClient/AgencyClientCommandHandler');
const {get} = require('lodash');
const _ = require('lodash');
const {EventStore} = require('../models');
const {QueryHelper, LinkHeaderHelper} = require('a24-node-query-utils');
const {AgencyClientsService} = require('../services/AgencyClientsService');
const {PaginationHelper} = require('../helpers/PaginationHelper');

/**
 * Add Agency Client Consultant
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.addAgencyClientConsultant = async (req, res, next) => {
  const payload = get(req, 'swagger.params.assign_client_consultant_payload.value', {});
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyClientRepository(EventStore);
  let handler = new AgencyClientCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: payload
  }

  try {
    // Passing in the agency and client ids here feels strange
    await handler.apply(agency_id, client_id, command);
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
 * Remove Agency Client Consultant
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.removeAgencyClientConsultant = async (req, res, next) => {
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');
  const consultant_id = get(req, 'swagger.params.consultant_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyClientRepository(EventStore);
  let handler = new AgencyClientCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: {_id: consultant_id}
  }

  try {
    await handler.apply(agency_id, client_id, command);
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
 module.exports.getAgencyClient = async (req, res, next) => {
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');

  // Consider using a builder | respository pattern
  let repository = new AgencyClientRepository(EventStore);
  try {
    let aggregate = await repository.getAggregate(agency_id, client_id);
    // This needs to be centralised and done better
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(aggregate));
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};


/**
 * Retrieves tags list
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {Function} next - The callback used to pass control to the next middleware
 *
 */
 module.exports.listAgencyClients = async (req, res, next) => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;

  let limit = QueryHelper.getItemsPerPage(swaggerParams);
  let skip = QueryHelper.getSkipValue(swaggerParams, limit);
  let sortBy = QueryHelper.getSortParams(swaggerParams);
  let query = QueryHelper.getQuery(swaggerParams);

  query.agency_id = get(req, 'swagger.params.agency_id.value', '');

  const service = new AgencyClientsService(logger);
  try {

    const {count, data} = await service.listResources(query, limit, skip, sortBy);
    const statusCode = _.isEmpty(data) ? 204 : 200;
    await PaginationHelper.setPaginationHeaders(req, res, count);
    res.statusCode = statusCode;
    if (_.isEmpty(data)) {
      logger.info('The GET list call of Tags has been completed successfully, but no records were found.', {
        statusCode
      });
      return res.end();
    }

    logger.info(
      'The GET list call of Tags has been completed successfully with result',
      {
        statusCode
      }
    );
    return res.end(JSON.stringify(data));

  } catch (error) {
    return next(error);
  }
};

// NEW GENERATOR FUNCTIONS LOCATION