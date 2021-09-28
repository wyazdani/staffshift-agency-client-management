import {ServerResponse} from 'http';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {get, isEmpty} from 'lodash';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {Error} from 'mongoose';
import {AgencyCommandBusFactory} from '../factories/AgencyCommandBusFactory';
import {
  AddAgencyConsultantRoleCommandInterface,
  DisableAgencyConsultantRoleCommandInterface,
  EnableAgencyConsultantRoleCommandInterface,
  UpdateAgencyConsultantRoleCommandInterface
} from '../Agency/types/CommandTypes';
import {AgencyCommandEnum} from '../Agency/types';
import {LocationHelper} from '../helpers/LocationHelper';

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
    const commandType = AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE;
    const commandBus = AgencyCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
    const roleId = new ObjectID().toString();
    const command: AddAgencyConsultantRoleCommandInterface = {
      type: commandType,
      data: {
        _id: roleId,
        ...payload
      }
    };

    await commandBus.execute(agencyId, command);
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
    const commandType = AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;
    const commandBus = AgencyCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
    const command: UpdateAgencyConsultantRoleCommandInterface = {
      type: commandType,
      data: {...payload, _id: consultantRoleId}
    };

    if (isEmpty(payload)) {
      throw new ValidationError('Nothing to update, you need to put at least one property to update');
    }

    await commandBus.execute(agencyId, command);
    res.statusCode = 202;
    res.end();
  } catch (err) {
    if (!(err instanceof ResourceNotFoundError) && !(err instanceof ValidationError)) {
      req.Logger.error('unknown error in updateAgencyConsultantRole', err);
    }
    next(err);
  }
};

/**
 * Enable the status of the Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 */
export const enableAgencyConsultantRole = async (req: SwaggerRequestInterface, res: ServerResponse): Promise<void> => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  const commandType = AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE;
  const commandBus = AgencyCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
  // Decide how auth / audit data gets from here to the event in the event store.
  const command: EnableAgencyConsultantRoleCommandInterface = {
    type: commandType,
    data: {_id: consultantRoleId}
  };

  try {
    // Passing in the agency id here feels strange
    await commandBus.execute(agencyId, command);
    // This needs to be centralised and done better
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: 'completed'}));
  } catch (err) {
    // This needs to be centralised and done better
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

/**
 * Disable the status of the Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 */
export const disableAgencyConsultantRole = async (req: SwaggerRequestInterface, res: ServerResponse): Promise<void> => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  const commandType = AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;
  const commandBus = AgencyCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
  // Decide how auth / audit data gets from here to the event in the event store.
  const command: DisableAgencyConsultantRoleCommandInterface = {
    type: commandType,
    data: {_id: consultantRoleId}
  };

  try {
    // Passing in the agency id here feels strange
    await commandBus.execute(agencyId, command);
    // This needs to be centralised and done better
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: 'completed'}));
  } catch (err) {
    // This needs to be centralised and done better
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

/**
 * Get Agency Consultant Role
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
export const getAgencyConsultantRole = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  // Consider using a builder | respository pattern
  const repository = new AgencyRepository(get(req, 'eventRepository', undefined));

  try {
    // This will most likely need to project only the section we are working with based on the route
    const aggregate = await repository.getAggregate(agencyId);
    const consultantRole = aggregate.getConsultantRole(consultantRoleId);

    // This needs to be centralised and done better
    if (consultantRole) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(consultantRole));

      return;
    }

    return next(
      new ResourceNotFoundError(
        `No agency consultant role found for agency: ${agencyId} and consultant: ${consultantRoleId}`
      )
    );
  } catch (err) {
    // This needs to be centralised and done better
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};

/**
 * List Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 */
export const listAgencyConsultantRoles = async (req: SwaggerRequestInterface, res: ServerResponse): Promise<void> => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  // Consider using a builder | respository pattern
  const repository = new AgencyRepository(get(req, 'eventRepository', undefined));

  try {
    // This will most likely need to project only the section we are working with based on the route
    const aggregate = await repository.getAggregate(agencyId);
    const consultantRoles = aggregate.getConsultantRoles();

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
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};
