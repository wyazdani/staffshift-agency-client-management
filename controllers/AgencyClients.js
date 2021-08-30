'use strict';
const {GenericRepository} = require('../src/GenericRepository');
const {AgencyClientRepository} = require('../src/AgencyClient/AgencyClientRepository');
const {AgencyClientCommandHandler} = require('../src/AgencyClient/AgencyClientCommandHandler');
const {get} = require('lodash');
const _ = require('lodash');
const {EventStore, AgencyClients} = require('../models');
const {QueryHelper} = require('a24-node-query-utils');
const {PaginationHelper} = require('../helpers/PaginationHelper');

/**
 * Gets a single agency client
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
 * Retrieves agency client listing
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

  const service = new GenericRepository(logger, AgencyClients);
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