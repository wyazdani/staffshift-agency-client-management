import {
  StartConsultantJobProcessCommandDataInterface,
  CompleteConsultantJobProcessCommandDataInterface,
  FailItemConsultantJobProcessCommandDataInterface,
  SucceedItemConsultantJobProcessCommandDataInterface
} from './CommandDataTypes';

export type ConsultantJobProcessCommandDataType =
  | StartConsultantJobProcessCommandDataInterface
  | CompleteConsultantJobProcessCommandDataInterface
  | FailItemConsultantJobProcessCommandDataInterface
  | SucceedItemConsultantJobProcessCommandDataInterface;
