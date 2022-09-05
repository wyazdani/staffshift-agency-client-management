import {
  SetRequiresBookingPasswordCommandDataInterface,
  SetRequiresPONumberCommandDataInterface,
  SetRequiresUniquePONumberCommandDataInterface,
  UnsetRequiresBookingPasswordCommandDataInterface,
  UnsetRequiresPONumberCommandDataInterface,
  UnsetRequiresUniquePONumberCommandDataInterface,
  UpdateBookingPasswordsCommandDataInterface
} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresBookingPasswordCommandDataInterface
  | UnsetRequiresBookingPasswordCommandDataInterface
  | UpdateBookingPasswordsCommandDataInterface
  | SetRequiresUniquePONumberCommandDataInterface
  | UnsetRequiresUniquePONumberCommandDataInterface
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface;
