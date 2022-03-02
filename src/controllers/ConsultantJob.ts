import {ServerResponse} from 'http';
import {get} from 'lodash';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ConsultantJobCommandEnum} from '../aggregates/ConsultantJob/types';
import {AssignConsultantCommandInterface} from '../aggregates/ConsultantJob/types/CommandTypes';
import {ConsultantJobCommandBusFactory} from '../factories/ConsultantJobCommandBusFactory';
import {ValidationError} from 'a24-node-error-utils';

export const assignConsultant = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const payload = get(req, 'swagger.params.assign_consultant_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const commandType = ConsultantJobCommandEnum.ASSIGN_CONSULTANT;
    const commandBus = ConsultantJobCommandBusFactory.getCommandBus(get(req, 'eventRepository'));
    const id = new ObjectID().toString();

    const command: AssignConsultantCommandInterface = {
      type: commandType,
      data: {
        _id: id,
        ...payload
      }
    };

    await commandBus.execute(agencyId, command);
    res.statusCode = 202;
    res.end();
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      req.Logger.error('unknown error in assignConsultant', {
        error: err,
        payload: get(req, 'swagger.params.assign_consultant_payload.value')
      });
    }
    next(err);
  }
};