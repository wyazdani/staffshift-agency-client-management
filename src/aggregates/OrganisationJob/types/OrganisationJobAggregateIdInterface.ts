import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface OrganisationJobAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'org_job';
  organisation_id: string;
}
