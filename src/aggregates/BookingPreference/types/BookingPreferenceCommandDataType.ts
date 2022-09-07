import {
  SetRequiresBookingPasswordCommandDataInterface,
  SetRequiresPONumberCommandDataInterface,
  SetRequiresUniquePONumberCommandDataInterface,
  UnsetRequiresBookingPasswordCommandDataInterface,
  UnsetRequiresPONumberCommandDataInterface,
  UnsetRequiresUniquePONumberCommandDataInterface,
  UpdateBookingPasswordsCommandDataInterface,
  SetRequiresShiftRefNumberCommandDataInterface
} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresBookingPasswordCommandDataInterface
  | UnsetRequiresBookingPasswordCommandDataInterface
  | UpdateBookingPasswordsCommandDataInterface
  | SetRequiresUniquePONumberCommandDataInterface
  | UnsetRequiresUniquePONumberCommandDataInterface
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface
  | SetRequiresShiftRefNumberCommandDataInterface;
