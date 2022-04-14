import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyAggregateIdInterface} from '../../aggregates/Agency/types';

export interface AgencyConsultantRoleEnabledEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyConsultantRoleEnabledEventInterface
  extends EventStorePubSubModelInterface<
    AgencyConsultantRoleEnabledEventStoreDataInterface,
    AgencyAggregateIdInterface
  > {}
