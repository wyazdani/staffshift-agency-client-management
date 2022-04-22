import {ConsultantJobProcessCommandEnum} from '../ConsultantJobProcessCommandEnum';
import {SucceedItemConsultantJobProcessCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobProcessCommandInterface} from '..';

export interface SucceedItemConsultantJobProcessCommandInterface extends ConsultantJobProcessCommandInterface {
  type: ConsultantJobProcessCommandEnum.SUCCEED_ITEM;
  data: SucceedItemConsultantJobProcessCommandDataInterface;
}
