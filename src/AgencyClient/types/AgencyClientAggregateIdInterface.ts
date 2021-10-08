import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';

export interface AgencyClientAggregateIdInterface extends BaseAggregateIdInterface {
  agency_id: string;
  client_id: string;
}
