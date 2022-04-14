import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyAggregateIdInterface} from '../../aggregates/Agency/types';

export interface AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  name?: string;
  description?: string;
  max_consultants?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyConsultantRoleDetailsUpdatedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface,
    AgencyAggregateIdInterface
  > {}
