import {ConsultantJobAssignErrorItemEnum} from '../ConsultantJobAssignErrorItemEnum';

export interface FailItemConsultantJobAssignCommandDataInterface {
  client_id: string;
  error_code: ConsultantJobAssignErrorItemEnum;
  error_message: string;
}
