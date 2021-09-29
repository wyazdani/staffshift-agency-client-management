import {ObjectID} from 'mongodb';
import {get, isEmpty} from 'lodash';
import {ServerResponse} from 'http';
import {AgencyClientCommandEnum} from '../AgencyClient/types';
import {GenericRepository} from '../GenericRepository';
import {AgencyClientConsultants} from '../models/AgencyClientConsultants';
import {PaginationHelper} from '../helpers/PaginationHelper';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {QueryHelper} from 'a24-node-query-utils';
import {Error} from 'mongoose';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {
  AddAgencyClientConsultantCommandInterface,
  RemoveAgencyClientConsultantCommandInterface
} from '../AgencyClient/types/CommandTypes';

/**
 * Add Agency Client Consultant
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - Function used to pass control to the next middleware
 */
export const addAgencyClientConsultant = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  const payload = get(req, 'swagger.params.assign_client_consultant_payload.value', {});
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const clientId = get(req, 'swagger.params.client_id.value', '');
  const commandType = AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;
  const commandBus = AgencyClientCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
  const agencyClientConsultantId = new ObjectID().toString();
  const command: AddAgencyClientConsultantCommandInterface = {
    type: commandType,
    data: {
      ...payload,
      _id: agencyClientConsultantId
    }
  };

  try {
    await commandBus.execute(agencyId, clientId, command);
    res.statusCode = 202;
    res.setHeader('Location', `${req.basePathName}/${agencyClientConsultantId}`);
    res.end();
  } catch (error) {
    next(error);
  }
};

/**
 * Remove Agency Client Consultant
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - Function used to pass control to the next middleware
 */
export const removeAgencyClientConsultant = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const consultantId = get(req, 'swagger.params.consultant_id.value', '');
    const commandType = AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;
    const commandBus = AgencyClientCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
    const command: RemoveAgencyClientConsultantCommandInterface = {
      type: commandType,
      data: {_id: consultantId}
    };

    await commandBus.execute(agencyId, clientId, command);
    res.statusCode = 202;
    res.end();
  } catch (err) {
    if (!(err instanceof ResourceNotFoundError)) {
      req.Logger.error('Unknown error in removeAgencyClientConsultant', err);
    }
    next(err);
  }
};

/**
 * List Agency Client Consultants
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {(error?: Error) => void} next - The callback used to pass control to the next action/middleware
 */
export const listAgencyClientConsultants = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;
  const limit = QueryHelper.getItemsPerPage(swaggerParams);
  const skip = QueryHelper.getSkipValue(swaggerParams, limit);
  const sortBy = QueryHelper.getSortParams(swaggerParams);
  const query = QueryHelper.getQuery(swaggerParams);

  query.agency_id = get(req, 'swagger.params.agency_id.value', '');
  query.client_id = get(req, 'swagger.params.client_id.value', '');
  const service = new GenericRepository(logger, AgencyClientConsultants);

  try {
    const {count, data} = await service.listResources(query, limit, skip, sortBy);
    const statusCode = isEmpty(data) ? 204 : 200;

    await PaginationHelper.setPaginationHeaders(req, res, count);
    res.statusCode = statusCode;
    if (isEmpty(data)) {
      logger.info('The GET list call of Tags has been completed successfully, but no records were found.', {
        statusCode
      });

      return res.end();
    }

    logger.info('The GET list call of Tags has been completed successfully with result', {
      statusCode
    });

    return res.end(JSON.stringify(data));
  } catch (error) {
    return next(error);
  }
};
