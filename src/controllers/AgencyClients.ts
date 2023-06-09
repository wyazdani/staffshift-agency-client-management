import {ServerResponse} from 'http';
import {GenericRepository} from '../GenericRepository';
import {get, isEmpty} from 'lodash';
import {AgencyClientsProjectionV2, AgencyClientsProjectionV2DocumentType} from '../models/AgencyClientsProjectionV2';
import {QueryHelper} from 'a24-node-query-utils';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {PaginationHelper} from '../helpers/PaginationHelper';

/**
 * Gets a single agency client
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
export const getAgencyClient = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  const logger = req.Logger;
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const clientId = get(req, 'swagger.params.client_id.value', '');

  try {
    const repository = new GenericRepository<AgencyClientsProjectionV2DocumentType>(logger, AgencyClientsProjectionV2);
    const agencyClient = await repository.findOne({client_id: clientId, agency_id: agencyId});

    if (isEmpty(agencyClient)) {
      logger.info('Resource retrieval completed, no record found.', {statusCode: 404});

      return next(new ResourceNotFoundError('Agency Client resource not found'));
    }

    logger.info('Resource retrieval completed', {statusCode: 200});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(agencyClient));
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves agency client listing
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
export const listAgencyClients = async (
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

  const service = new GenericRepository<AgencyClientsProjectionV2DocumentType>(logger, AgencyClientsProjectionV2);

  try {
    const {count, data} = await service.listResources(query, limit, skip, sortBy);
    const statusCode = isEmpty(data) ? 204 : 200;

    await PaginationHelper.setPaginationHeaders(req, res, count);
    res.statusCode = statusCode;
    if (isEmpty(data)) {
      logger.info('Resource listing completed, no records found.', {statusCode});

      res.end();
      return;
    }

    logger.info('Resource listing completed', {statusCode});

    res.end(JSON.stringify(data));
  } catch (error) {
    return next(error);
  }
};
