import {ServerResponse} from 'http';
import {get} from 'lodash';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ConsultantJobCommandEnum} from '../aggregates/ConsultantJob/types';
import {AssignConsultantCommandInterface} from '../aggregates/ConsultantJob/types/CommandTypes';
import {ValidationError} from 'a24-node-error-utils';

export const assignConsultant = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const payload = get(req, 'swagger.params.assign_consultant_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const id = new ObjectID().toString();
    const command: AssignConsultantCommandInterface = {
      aggregateId: {name: 'consultant_job', agency_id: agencyId},
      type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
      data: {
        _id: id,
        ...payload
      }
    };

    await req.commandBus.execute(command);
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
