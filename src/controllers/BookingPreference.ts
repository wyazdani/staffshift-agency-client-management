import {ServerResponse} from 'http';
import {get} from 'lodash';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {BookingPreferenceCommandEnum} from '../aggregates/BookingPreference/types';
import {
  SetRequiresBookingPasswordCommandInterface,
  SetRequiresPONumberCommandInterface,
  SetRequiresUniquePONumberCommandInterface,
  UnsetRequiresBookingPasswordCommandInterface,
  UnsetRequiresPONumberCommandInterface,
  UnsetRequiresUniquePONumberCommandInterface,
  UpdateBookingPasswordsCommandInterface,
  SetRequiresShiftRefNumberCommandInterface,
  UnsetRequiresShiftRefNumberCommandInterface
} from '../aggregates/BookingPreference/types/CommandTypes';
import {
  AgencyClientBookingPreferencesProjectionV1DocumentType,
  AgencyClientBookingPreferencesProjection
} from '../models/AgencyClientBookingPreferencesProjectionV1';
import {GenericRepository} from '../GenericRepository';
import {IfMatchHelper} from './../helpers/IfMatchHelper';

const BOOKING_PREFERENCE_AGGREGATE_NAME = 'booking_preference';

export const setRequiresPONumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: SetRequiresPONumberCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const unsetRequiresPONumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: UnsetRequiresPONumberCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const setRequiresUniquePONumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: SetRequiresUniquePONumberCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const unsetRequiresUniquePONumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: UnsetRequiresUniquePONumberCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const setRequiresBookingPassword = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const payload = get(req, 'swagger.params.set_requires_booking_password_payload.value', {});
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: SetRequiresBookingPasswordCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
      data: {...payload},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const unsetRequiresBookingPassword = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: UnsetRequiresBookingPasswordCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const updateBookingPassword = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const payload = get(req, 'swagger.params.update_booking_password_payload.value', {});
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: UpdateBookingPasswordsCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
      data: {...payload},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const setRequiresShiftRefNumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: SetRequiresShiftRefNumberCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const unsetRequiresShiftRefNumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const ifMatch = get(req, 'swagger.params.If-Match.value', '');
    const lock = IfMatchHelper.getAggregateVersion(ifMatch, BOOKING_PREFERENCE_AGGREGATE_NAME);
    const command: UnsetRequiresShiftRefNumberCommandInterface = {
      aggregateId: {
        name: BOOKING_PREFERENCE_AGGREGATE_NAME,
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER,
      data: {},
      optimistic_lock: lock
    };

    const eventId = await req.commandBus.execute(command);

    res.statusCode = 202;
    setAggregateEtagHeader(res, eventId);
    res.end();
  } catch (err) {
    next(err);
  }
};

/**
 * returns booking preference for the agency client from the read projection
 */
export const getBookingPreference = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error?: Error) => void
): Promise<void> => {
  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const repository = new GenericRepository<AgencyClientBookingPreferencesProjectionV1DocumentType>(
      req.Logger,
      AgencyClientBookingPreferencesProjection
    );
    const record = await repository.findOne({
      agency_id: agencyId,
      client_id: clientId
    });

    if (!record) {
      return next(new ResourceNotFoundError('No booking preference found for this client in that agency'));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(record));
  } catch (err) {
    next(err);
  }
};

const setAggregateEtagHeader = (res: ServerResponse, eventId: number): void => {
  res.setHeader('ETag', `W/"${BOOKING_PREFERENCE_AGGREGATE_NAME}:${eventId}"`);
};
