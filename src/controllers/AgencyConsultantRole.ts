import {ServerResponse} from 'http';
import {SwaggerRequest} from 'SwaggerRequest';
import {get} from 'lodash';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyCommandBusFactory} from "../factories/AgencyCommandBusFactory";
const {ResourceNotFoundError} = require('a24-node-error-utils');

/**
 * Add Agency Consultant Role
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.addAgencyConsultantRole = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const payload = get(req, 'swagger.params.agency_consultant_role_payload.value', {});
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  const repository = new AgencyRepository(get(req, 'eventRepository', undefined));
  const agencyCommandBus = AgencyCommandBusFactory.getAgencyCommandBus(repository)

  // Decide how auth / audit data gets from here to the event in the event store.
  const command = {
    type: command_type,
    data: payload
  };

  try {
    // Passing in the agency id here feels strange
    await agencyCommandBus.execute(agencyId, command);
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
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.updateAgencyConsultantRole = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const payload = get(req, 'swagger.params.agency_consultant_role_update_payload.value', {});
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  const repository = new AgencyRepository(get(req, 'eventRepository', undefined));
  const agencyCommandBus = AgencyCommandBusFactory.getAgencyCommandBus(repository)

  // Decide how auth / audit data gets from here to the event in the event store.
  const command = {
    type: command_type,
    data: {...payload, _id: consultantRoleId}
  };

  try {
    // Passing in the agency id here feels strange
    await agencyCommandBus.execute(agencyId, command);
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
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.changeStatusAgencyConsultantRole = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const agencyId = get(req, 'swagger.params.agency_id.value', '');
  const consultantRoleId = get(req, 'swagger.params.consultant_role_id.value', '');
  const command_type = get(req, 'swagger.operation.x-octophant-event', '');

  const repository = new AgencyRepository(get(req, 'eventRepository', undefined));
  const agencyCommandBus = AgencyCommandBusFactory.getAgencyCommandBus(repository)

  // Decide how auth / audit data gets from here to the event in the event store.
  const command = {
    type: command_type,
    data: {_id: consultantRoleId}
  };

  try {
    // Passing in the agency id here feels strange
    await agencyCommandBus.execute(agencyId, command);
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
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.getAgencyConsultantRole = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
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
 * List Agency Consultant Role
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.listAgencyConsultantRoles = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
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
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};