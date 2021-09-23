import _ from 'lodash';
import {ServerResponse} from 'http';
import {GenericRepository} from '../GenericRepository';
import {AgencyClientConsultants} from '../models/AgencyClientConsultants';
import {PaginationHelper} from '../helpers/PaginationHelper';
import {SwaggerRequest} from 'SwaggerRequest';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
const {QueryHelper} = require('a24-node-query-utils');

/**
 * Add Agency Client Consultant
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.addAgencyClientConsultant = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const payload = _.get(req, 'swagger.params.assign_client_consultant_payload.value', {});
  const agencyId = _.get(req, 'swagger.params.agency_id.value', '');
  const clientId = _.get(req, 'swagger.params.client_id.value', '');
  const commandType = _.get(req, 'swagger.operation.x-octophant-event', '');

  const commandBus = AgencyClientCommandBusFactory.getCommandBus(_.get(req, 'eventRepository'))
  // Decide how auth / audit data gets from here to the event in the event store.
  const command = {
    type: commandType,
    data: payload
  };

  try {
    // Passing in the agency and client ids here feels strange
    await commandBus.execute(agencyId, clientId, command);
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
module.exports.removeAgencyClientConsultant = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const agencyId = _.get(req, 'swagger.params.agency_id.value', '');
  const clientId = _.get(req, 'swagger.params.client_id.value', '');
  const consultant_id = _.get(req, 'swagger.params.consultant_id.value', '');
  const commandType = _.get(req, 'swagger.operation.x-octophant-event', '');
  const commandBus = AgencyClientCommandBusFactory.getCommandBus(_.get(req, 'eventRepository'))

  // Decide how auth / audit data gets from here to the event in the event store.
  const command = {
    type: commandType,
    data: {
      _id: consultant_id,
      consultant_id: 'test', // remove
      consultant_role_id: 'blah' // remove
    }
  };

  try {
    await commandBus.execute(agencyId, clientId, command);
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
 * List Agency Client Consultants
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.listAgencyClientConsultants = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;

  const limit = QueryHelper.getItemsPerPage(swaggerParams);
  const skip = QueryHelper.getSkipValue(swaggerParams, limit);
  const sortBy = QueryHelper.getSortParams(swaggerParams);
  const query = QueryHelper.getQuery(swaggerParams);

  query.agency_id = _.get(req, 'swagger.params.agency_id.value', '');
  query.client_id = _.get(req, 'swagger.params.client_id.value', '');
  const service = new GenericRepository(logger, AgencyClientConsultants);
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