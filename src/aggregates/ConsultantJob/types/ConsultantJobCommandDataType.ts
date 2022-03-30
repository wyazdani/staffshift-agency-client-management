import {AssignConsultantCommandDataInterface, CompleteAssignConsultantCommandDataInterface} from './CommandDataTypes';

export type ConsultantJobCommandDataType =
  | AssignConsultantCommandDataInterface
  | CompleteAssignConsultantCommandDataInterface;
