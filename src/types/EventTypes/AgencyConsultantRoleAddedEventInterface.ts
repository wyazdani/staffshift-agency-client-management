import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyAggregateIdInterface} from '../../aggregates/Agency/types';

export interface AgencyConsultantRoleAddedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  name: string;
  description: string;
  max_consultants: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyConsultantRoleAddedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyConsultantRoleAddedEventStoreDataInterface,
    AgencyAggregateIdInterface
  > {}
