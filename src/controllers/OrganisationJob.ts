import {ServerResponse} from 'http';
import {get, isEmpty} from 'lodash';
import {ObjectID} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {
  InitiateApplyPaymentTermCommandInterface,
  InitiateInheritPaymentTermCommandInterface
} from '../aggregates/OrganisationJob/types/CommandTypes';
import {OrganisationJobCommandEnum} from '../aggregates/OrganisationJob/types';
import {GenericRepository} from '../GenericRepository';
import {
  AgencyClientPaymentTermsProjectionV1DocumentType,
  AgencyClientPaymentTermsProjection
} from '../models/AgencyClientPaymentTermsProjectionV1';
import {AgencyClientsProjectionV2, AgencyClientsProjectionV2DocumentType} from '../models/AgencyClientsProjectionV2';
import {LoggerContext} from 'a24-logzio-winston';

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

    const clientInformation = await getClientInformation(agencyId, clientId, logger);

    if (isEmpty(clientInformation)) {
      logger.info('Resource retrieval completed, no record found.', {statusCode: 404});

      return next(new ResourceNotFoundError('Agency Client resource not found'));
    }
    const command: InitiateApplyPaymentTermCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        organisation_id: clientInformation.organisation_id
      },
      type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
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

    const clientInformation = await getClientInformation(agencyId, clientId, logger);

    if (isEmpty(clientInformation)) {
      logger.info('Resource retrieval completed, no record found.', {statusCode: 404});

      return next(new ResourceNotFoundError('Agency Client resource not found'));
    }

    if (clientInformation.client_type === 'organisation') {
      return next(
        new ValidationError('Operation not possible due to inheritance problem').setErrors([
          {
            code: 'INVALID_CLIENT_TYPE',
            message: 'Cannot be inherited on organisation client type'
          }
        ])
      );
    }

    const command: InitiateInheritPaymentTermCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        organisation_id: clientInformation.organisation_id
      },
      type: OrganisationJobCommandEnum.INITIATE_INHERIT_PAYMENT_TERM,
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

const getClientInformation = async (agencyId: string, clientId: string, logger: LoggerContext) => {
  const repository = new GenericRepository<AgencyClientsProjectionV2DocumentType>(logger, AgencyClientsProjectionV2);
  const agencyClient = await repository.findOne({client_id: clientId, agency_id: agencyId});

  if (isEmpty(agencyClient) || agencyClient.linked === false) {
    return null;
  }
  return agencyClient.client_type === 'organisation'
    ? {organisation_id: agencyClient.client_id, client_type: agencyClient.client_type}
    : {organisation_id: agencyClient.organisation_id, client_type: agencyClient.client_type};
};

export const getPaymentTerm = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const repository = new GenericRepository<AgencyClientPaymentTermsProjectionV1DocumentType>(
      req.Logger,
      AgencyClientPaymentTermsProjection
    );
    const record = await repository.findOne({
      agency_id: agencyId,
      client_id: clientId
    });

    if (!record) {
      return next(new ResourceNotFoundError('No payment term found for this client in that agency'));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(record));
  } catch (err) {
    req.Logger.error('getPaymentTerm unknown error', err);
    next(err);
  }
};