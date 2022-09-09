import {
  SetRequiresBookingPasswordCommandDataInterface,
  SetRequiresPONumberCommandDataInterface,
  SetRequiresUniquePONumberCommandDataInterface,
  UnsetRequiresBookingPasswordCommandDataInterface,
  UnsetRequiresPONumberCommandDataInterface,
  UnsetRequiresUniquePONumberCommandDataInterface,
  UpdateBookingPasswordsCommandDataInterface,
  SetRequiresShiftRefNumberCommandDataInterface,
  UnsetRequiresShiftRefNumberCommandDataInterface
} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresBookingPasswordCommandDataInterface
  | UnsetRequiresBookingPasswordCommandDataInterface
  | UpdateBookingPasswordsCommandDataInterface
  | SetRequiresUniquePONumberCommandDataInterface
  | UnsetRequiresUniquePONumberCommandDataInterface
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface
  | SetRequiresShiftRefNumberCommandDataInterface
  | UnsetRequiresShiftRefNumberCommandDataInterface;
