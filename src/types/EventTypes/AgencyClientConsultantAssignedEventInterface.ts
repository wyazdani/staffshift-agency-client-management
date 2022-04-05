import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyClientAggregateIdInterface} from '../../aggregates/AgencyClient/types';

export interface AgencyClientConsultantAssignedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_role_id: string;
  consultant_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientConsultantAssignedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientConsultantAssignedEventStoreDataInterface,
    AgencyClientAggregateIdInterface
  > {}
