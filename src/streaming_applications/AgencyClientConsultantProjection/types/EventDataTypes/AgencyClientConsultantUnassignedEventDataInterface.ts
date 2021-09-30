import {AgencyClientAggregateIdInterface} from '../../../../AgencyClient/types';

export interface AgencyClientConsultantUnassignedEventDataInterface {
  type: string;
  sequence_id: number;
  aggregate_id: AgencyClientAggregateIdInterface;
  data: {
    _id: string;
  };
}
