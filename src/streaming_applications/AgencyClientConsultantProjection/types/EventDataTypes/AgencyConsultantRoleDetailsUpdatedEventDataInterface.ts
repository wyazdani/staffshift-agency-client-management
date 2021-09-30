import {AgencyAggregateIdInterface} from '../../../../Agency/types';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../../../../Agency/types/CommandDataTypes';

export interface AgencyConsultantRoleDetailsUpdatedEventDataInterface {
  type: string;
  sequence_id: number;
  aggregate_id: AgencyAggregateIdInterface;
  data: UpdateAgencyConsultantRoleCommandDataInterface;
}
