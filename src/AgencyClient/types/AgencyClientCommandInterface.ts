import {AgencyClientCommandEnum} from './AgencyClientCommandEnum';
import {AgencyClientConsultantInterface} from './AgencyClientConsultantInterface';

export interface AgencyClientCommandInterface {
  type: AgencyClientCommandEnum;
  data: AgencyClientConsultantInterface;
}
