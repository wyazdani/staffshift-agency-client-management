import {ServerResponse} from 'http';
import {get} from 'lodash';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ValidationError} from 'a24-node-error-utils';
import {
  InitiateApplyPaymentTermCommandInterface,
  InitiateInheritPaymentTermCommandInterface
} from '../aggregates/OrganisationJob/types/CommandTypes';
import {OrganisationJobCommandEnum} from '../aggregates/OrganisationJob/types';
import {GenericRepository} from '../GenericRepository';
import {AgencyClientsProjectionV2, AgencyClientsProjectionV2DocumentType} from '../models/AgencyClientsProjectionV2';

export const initiateApplyPaymentTerm = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  const logger = req.Logger;

  try {
    const payload = get(req, 'swagger.params.initiate_apply_payment_term_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const id = new ObjectID().toString();
    const repository = new GenericRepository<AgencyClientsProjectionV2DocumentType>(logger, AgencyClientsProjectionV2);
    const agencyClient = await repository.findOne({client_id: clientId, agency_id: agencyId});
    const command: InitiateApplyPaymentTermCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: agencyClient.organisation_id
      },
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
      req.Logger.error('unknown error in initiateApplyPaymentTerm', {
        error: err,
        payload: get(req, 'swagger.params.initiate_apply_payment_term_payload.value')
      });
    }
    next(err);
  }
};

export const initiateInheritApplyPaymentTerm = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  const logger = req.Logger;

  try {
    const payload = get(req, 'swagger.params.initiate_apply_payment_term_payload.value', {});
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const id = new ObjectID().toString();
    const repository = new GenericRepository<AgencyClientsProjectionV2DocumentType>(logger, AgencyClientsProjectionV2);
    const agencyClient = await repository.findOne({client_id: clientId, agency_id: agencyId});
    const command: InitiateInheritPaymentTermCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        organisation_id: agencyClient.organisation_id
      },
      type: OrganisationJobCommandEnum.INHERIT_PAYMENT_TERM,
      data: {
        _id: id,
        client_id: clientId,
        ...payload
      }
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
    res.end();
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      req.Logger.error('unknown error in initiateApplyPaymentTerm', {
        error: err,
        payload: get(req, 'swagger.params.initiate_apply_payment_term_payload.value')
      });
    }
    next(err);
  }
};
