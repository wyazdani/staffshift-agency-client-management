import {
  AssignConsultantCommandDataInterface,
  CompleteAssignConsultantCommandDataInterface,
  UnassignConsultantCommandDataInterface
} from './CommandDataTypes';

export type ConsultantJobCommandDataType =
  | AssignConsultantCommandDataInterface
  | CompleteAssignConsultantCommandDataInterface
  | UnassignConsultantCommandDataInterface;
