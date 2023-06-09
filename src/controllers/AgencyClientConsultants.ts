import {ObjectId} from 'mongodb';
import {get, isEmpty} from 'lodash';
import {ServerResponse} from 'http';
import {AgencyClientCommandEnum} from '../aggregates/AgencyClient/types';
import {GenericRepository} from '../GenericRepository';
import {
  AgencyClientConsultantV3DocumentType,
  AgencyClientConsultantsProjectionV3
} from '../models/AgencyClientConsultantsProjectionV3';
import {PaginationHelper} from '../helpers/PaginationHelper';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {QueryHelper} from 'a24-node-query-utils';
import {Error} from 'mongoose';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {
  AddAgencyClientConsultantCommandInterface,
  RemoveAgencyClientConsultantCommandInterface
} from '../aggregates/AgencyClient/types/CommandTypes';

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
  try {
    const payload = get(req, 'swagger.params.assign_client_consultant_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const agencyClientConsultantId = new ObjectId().toString();
    const command: AddAgencyClientConsultantCommandInterface = {
      aggregateId: {agency_id: agencyId, client_id: clientId},
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {...payload, _id: agencyClientConsultantId}
    };

    await req.commandBus.execute(command);
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
    const clientConsultantId = get(req, 'swagger.params.client_consultant_id.value', '');
    const command: RemoveAgencyClientConsultantCommandInterface = {
      aggregateId: {agency_id: agencyId, client_id: clientId},
      type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT,
      data: {_id: clientConsultantId}
    };

    await req.commandBus.execute(command);
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
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next action/middleware
 */
export const listAgencyClientConsultants = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  try {
    const swaggerParams = req.swagger.params || {};
    const logger = req.Logger;
    const limit = QueryHelper.getItemsPerPage(swaggerParams);
    const skip = QueryHelper.getSkipValue(swaggerParams, limit);
    const sortBy = QueryHelper.getSortParams(swaggerParams);
    const query = QueryHelper.getQuery(swaggerParams);

    query.agency_id = get(req, 'swagger.params.agency_id.value', '');
    query.client_id = get(req, 'swagger.params.client_id.value', '');

    const service = new GenericRepository<AgencyClientConsultantV3DocumentType>(
      logger,
      AgencyClientConsultantsProjectionV3
    );
    const {count, data} = await service.listResources(query, limit, skip, sortBy);
    const statusCode = isEmpty(data) ? 204 : 200;

    await PaginationHelper.setPaginationHeaders(req, res, count);
    res.statusCode = statusCode;
    if (isEmpty(data)) {
      logger.info(
        'The GET list call of agency client consultants has been completed successfully, but no records were found.',
        {
          statusCode
        }
      );

      res.end();
      return;
    }

    logger.info('The GET list call of agency client consultants has been completed successfully with result', {
      statusCode
    });

    res.end(JSON.stringify(data));
  } catch (error) {
    return next(error);
  }
};
