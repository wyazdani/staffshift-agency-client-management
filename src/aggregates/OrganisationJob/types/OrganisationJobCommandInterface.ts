import {OrganisationJobCommandDataType} from './OrganisationJobCommandDataType';
import {AggregateCommandInterface} from '../../../aggregates/types';
import {OrganisationJobAggregateIdInterface} from './OrganisationJobAggregateIdInterface';
import {OrganisationJobCommandEnum} from './OrganisationJobCommandEnum';

export interface OrganisationJobCommandInterface extends AggregateCommandInterface {
  aggregateId: OrganisationJobAggregateIdInterface;
  type: OrganisationJobCommandEnum;
  data: OrganisationJobCommandDataType; // Work In Progress
}
