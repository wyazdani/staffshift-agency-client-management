import {
  ApplyPaymentTermOrganisationJobCommandDataInterface,
  CompleteApplyPaymentTermOrganisationJobCommandDataInterface
} from './CommandTypes';

export type OrganisationJobCommandDataType =
  | ApplyPaymentTermOrganisationJobCommandDataInterface
  | CompleteApplyPaymentTermOrganisationJobCommandDataInterface;
