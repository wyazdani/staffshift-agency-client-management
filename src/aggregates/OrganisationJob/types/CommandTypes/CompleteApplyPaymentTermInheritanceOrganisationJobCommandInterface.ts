import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteApplyPaymentTermInheritanceOrganisationJobCommandDataInterface {
  _id: string;
}

export interface CompleteApplyPaymentTermInheritanceOrganisationJobCommandInterface
  extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM_INHERITANCE;
  data: CompleteApplyPaymentTermInheritanceOrganisationJobCommandDataInterface;
}
