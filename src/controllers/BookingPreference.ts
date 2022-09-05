import {ServerResponse} from 'http';
import {get, isEmpty} from 'lodash';
import {ObjectId} from 'mongodb';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {BookingPreferenceCommandEnum} from '../aggregates/BookingPreference/types';
import {
  SetRequiresPONumberCommandInterface,
  UnsetRequiresPONumberCommandInterface,
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
