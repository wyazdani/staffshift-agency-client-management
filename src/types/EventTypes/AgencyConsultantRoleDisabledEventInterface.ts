import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyAggregateIdInterface} from '../../aggregates/Agency/types';

export interface AgencyConsultantRoleDisabledEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyConsultantRoleDisabledEventInterface
  extends EventStorePubSubModelInterface<
    AgencyConsultantRoleDisabledEventStoreDataInterface,
    AgencyAggregateIdInterface
  > {}
