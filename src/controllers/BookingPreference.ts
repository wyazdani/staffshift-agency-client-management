import {ServerResponse} from 'http';
import {get, isEmpty} from 'lodash';
import {ObjectId} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
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

export const setRequiresPONumber = async (
  req: SwaggerRequestInterface,
  res: ServerResponse,
  next: (error: Error) => void
): Promise<void> => {
  const logger = req.Logger;

  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const command: SetRequiresPONumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
  const logger = req.Logger;

  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const command: UnsetRequiresPONumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
    const command: SetRequiresUniquePONumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
    const command: UnsetRequiresUniquePONumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
    const command: SetRequiresBookingPasswordCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
      data: {...payload}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
    const command: UnsetRequiresBookingPasswordCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
    const command: UpdateBookingPasswordsCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
      data: {...payload}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
  const logger = req.Logger;

  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const command: SetRequiresShiftRefNumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
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
  const logger = req.Logger;

  try {
    const agencyId = get(req, 'swagger.params.agency_id.value', '');
    const clientId = get(req, 'swagger.params.client_id.value', '');
    const command: UnsetRequiresShiftRefNumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER,
      data: {}
    };

    await req.commandBus.execute(command);
    res.statusCode = 202;
    res.end();
  } catch (err) {
    next(err);
  }
};
