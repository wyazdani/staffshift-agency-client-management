import {AgencyClientAggregateIdInterface} from '../../../../AgencyClient/types';
import {AddAgencyClientConsultantCommandDataInterface} from '../../../../AgencyClient/types/CommandDataTypes';

export interface AgencyClientConsultantAssignedEventDataInterface {
  type: string;
  sequence_id: number;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: AddAgencyClientConsultantCommandDataInterface;
}
