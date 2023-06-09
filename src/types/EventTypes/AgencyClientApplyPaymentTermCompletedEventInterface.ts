import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {OrganisationJobAggregateIdInterface} from '../../aggregates/OrganisationJob/types';

export interface AgencyClientApplyPaymentTermCompletedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientApplyPaymentTermCompletedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientApplyPaymentTermCompletedEventStoreDataInterface,
    OrganisationJobAggregateIdInterface
  > {}
