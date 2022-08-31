import {SetRequiresPONumberCommandDataInterface, UnsetRequiresPONumberCommandDataInterface} from './CommandTypes';

export type BookingPreferenceCommandDataType =
  | SetRequiresPONumberCommandDataInterface
  | UnsetRequiresPONumberCommandDataInterface;
