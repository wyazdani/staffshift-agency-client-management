import {
  SetRequiresPONumberCommandDataInterface,
  SetRequiresUniquePONumberCommandDataInterface,
  UnsetRequiresPONumberCommandDataInterface,
  UnsetRequiresUniquePONumberCommandDataInterface
} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresUniquePONumberCommandDataInterface
  | UnsetRequiresUniquePONumberCommandDataInterface
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface;
