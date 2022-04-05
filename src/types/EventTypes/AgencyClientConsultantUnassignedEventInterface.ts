import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyClientAggregateIdInterface} from '../../aggregates/AgencyClient/types';

export interface AgencyClientConsultantUnassignedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientConsultantUnassignedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientConsultantUnassignedEventStoreDataInterface,
    AgencyClientAggregateIdInterface
  > {}
