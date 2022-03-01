import {AgencyConsultantRoleEnum} from './AgencyConsultantRoleEnum';

export interface AgencyConsultantRoleInterface {
  _id: string;
  name: string;
  description: string;
  max_consultants: number;
  status?: AgencyConsultantRoleEnum;
}
