import {
  SetRequiresPONumberCommandDataInterface,
  UnsetRequiresPONumberCommandDataInterface,
  SetRequiresShiftRefNumberCommandDataInterface,
  UnsetRequiresShiftRefNumberCommandDataInterface
} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface
  | SetRequiresShiftRefNumberCommandDataInterface
  | UnsetRequiresShiftRefNumberCommandDataInterface;
