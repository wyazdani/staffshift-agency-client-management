import {ServerResponse} from 'http';
import {get} from 'lodash';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ValidationError} from 'a24-node-error-utils';
import {InitiateApplyPaymentTermCommandInterface} from '../aggregates/OrganisationJob/types/CommandTypes';
import {OrganisationJobCommandEnum} from '../aggregates/OrganisationJob/types';

export const applyPaymentTerm = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const payload = get(req, 'swagger.params.assign_consultant_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const id = new ObjectID().toString();
    const command: InitiateApplyPaymentTermCommandInterface = {
      aggregateId: {name: 'organisation_job', agency_id: agencyId, organisation_id: clientId},
      type: OrganisationJobCommandEnum.APPLY_PAYMENT_TERM,
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
      req.Logger.error('unknown error in applyPaymentTerm', {
        error: err,
        payload: get(req, 'swagger.params.assign_consultant_payload.value')
      });
    }
    next(err);
  }
};
