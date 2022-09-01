import {
  SetRequiresPONumberCommandDataInterface,
  UnsetRequiresPONumberCommandDataInterface,
  SetRequiresShiftRefNumberCommandDataInterface
} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface
  | SetRequiresShiftRefNumberCommandDataInterface;
