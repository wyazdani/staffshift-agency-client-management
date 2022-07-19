import {
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from './CommandTypes';
export type OrganisationJobCommandDataType =
  | CompleteApplyPaymentTermCommandDataInterface
  | InitiateApplyPaymentTermCommandDataInterface
  | InitiateInheritPaymentTermCommandDataInterface
  | CompleteInheritPaymentTermCommandDataInterface;
