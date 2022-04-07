import {ServerResponse} from 'http';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {get, isEmpty} from 'lodash';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {Error} from 'mongoose';
import {
  AddAgencyConsultantRoleCommandInterface,
  DisableAgencyConsultantRoleCommandInterface,
  EnableAgencyConsultantRoleCommandInterface,
  UpdateAgencyConsultantRoleCommandInterface
} from '../aggregates/Agency/types/CommandTypes';
import {AgencyCommandEnum} from '../aggregates/Agency/types';
import {GenericRepository} from '../GenericRepository';
import {LocationHelper} from '../helpers/LocationHelper';
import {QueryHelper} from 'a24-node-query-utils';
import {PaginationHelper} from '../helpers/PaginationHelper';
import {
  AgencyConsultantRolesProjectionV2,
  AgencyConsultantRolesProjectionV2DocumentType
} from '../models/AgencyConsultantRolesProjectionV2';

/**
 * Add Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The next function
 */
export const addAgencyConsultantRole = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const payload = get(req, 'swagger.params.agency_consultant_role_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const roleId = new ObjectID().toString();
    const cmd = {
      aggregateId: {agency_id: agencyId},
      type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
      data: {_id: roleId, ...payload}
    } as AddAgencyConsultantRoleCommandInterface;

    await req.commandBus.execute(cmd);
    res.statusCode = 202;
    res.setHeader('Location', LocationHelper.getRelativeLocation(`/agency/${agencyId}/consultant-roles/${roleId}`));
    res.end();
  } catch (err) {
    next(err);
  }
};

/**
 * Update the details of a Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The next function
 */
export const updateAgencyConsultantRole = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const payload = get(req, 'swagger.params.agency_consultant_role_update_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');

    if (isEmpty(payload)) {
      throw new ValidationError('Nothing to update, you need to put at least one property to update');
    }

    const cmd = {
      aggregateId: {agency_id: agencyId},
      type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
      data: {...payload, _id: consultantRoleId}
    } as UpdateAgencyConsultantRoleCommandInterface;

    await req.commandBus.execute(cmd);
    res.statusCode = 202;
    res.end();
  } catch (err) {
    if (!(err instanceof ResourceNotFoundError) && !(err instanceof ValidationError)) {
      req.Logger.error('unknown error in updateAgencyConsultantRole', {
        err,
        payload: get(req, 'swagger.params.agency_consultant_role_update_payload.value')
      });
    }
    next(err);
  }
};

/**
 * Enable the status of the Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
export const enableAgencyConsultantRole = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
    const cmd = {
      aggregateId: {agency_id: agencyId},
      type: AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE,
      data: {_id: consultantRoleId}
    } as EnableAgencyConsultantRoleCommandInterface;

    await req.commandBus.execute(cmd);
    // This needs to be centralised and done better
    res.statusCode = 202;
    res.setHeader('Content-Type', 'application/json');
    res.end();
  } catch (error) {
    if (!(error instanceof ResourceNotFoundError)) {
      req.Logger.error('Unknown error in enableAgencyConsultantRole', error);
    }
    return next(error);
  }
};

/**
 * Disable the status of the Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
export const disableAgencyConsultantRole = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
    const cmd = {
      aggregateId: {agency_id: agencyId},
      type: AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE,
      data: {_id: consultantRoleId}
    } as DisableAgencyConsultantRoleCommandInterface;

    await req.commandBus.execute(cmd);
    // This needs to be centralised and done better
    res.statusCode = 202;
    res.setHeader('Content-Type', 'application/json');
    res.end();
  } catch (error) {
    if (!(error instanceof ResourceNotFoundError)) {
      req.Logger.error('Unknown error in disableAgencyConsultantRole', error);
    }
    return next(error);
  }
};

/**
 * Get Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
export const getAgencyConsultantRole = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
    const repository = new GenericRepository<AgencyConsultantRolesProjectionV2DocumentType>(
      req.Logger,
      AgencyConsultantRolesProjectionV2
    );
    const record = await repository.findOne({
      _id: consultantRoleId,
      agency_id: agencyId
    });

    if (!record) {
      return next(new ResourceNotFoundError('No agency consultant role found'));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(record.toJSON()));
  } catch (err) {
    req.Logger.error('getAgencyConsultantRole unknown error', {
      err,
      consultantRoleId: get(req, 'swagger.params.consultant_role_id.value')
    });
    next(err);
  }
};

/**
 * List Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The next function
 */
export const listAgencyConsultantRoles = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const swaggerParams = req.swagger.params || {};
    const limit = QueryHelper.getItemsPerPage(swaggerParams);
    const skip = QueryHelper.getSkipValue(swaggerParams, limit);
    const sortBy = QueryHelper.getSortParams(swaggerParams);
    const query = QueryHelper.getQuery(swaggerParams);

    query.agency_id = agencyId;
    const service = new GenericRepository<AgencyConsultantRolesProjectionV2DocumentType>(
      req.Logger,
      AgencyConsultantRolesProjectionV2
    );
    const {count, data} = await service.listResources(query, limit, skip, sortBy);

    if (isEmpty(data)) {
      res.statusCode = 204;
      res.end();
    } else {
      await PaginationHelper.setPaginationHeaders(req, res, count);
      res.end(JSON.stringify(data));
    }
    req.Logger.info('listAgencyConsultantRoles completed', {statusCode: res.statusCode});
  } catch (err) {
    req.Logger.error('listAgencyConsultantRoles unknown error', {err});
    next(err);
  }
};
