import {ConsultantJobProcessCommandEnum} from '../ConsultantJobProcessCommandEnum';
import {FailItemConsultantJobProcessCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobProcessCommandInterface} from '..';

export interface FailItemConsultantJobProcessCommandInterface extends ConsultantJobProcessCommandInterface {
  type: ConsultantJobProcessCommandEnum.FAIL_ITEM;
  data: FailItemConsultantJobProcessCommandDataInterface;
}
