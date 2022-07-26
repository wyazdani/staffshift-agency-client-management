import {BaseEventStoreDataInterface} from 'EventTypes';
import {OrganisationJobAggregateIdInterface} from '../../aggregates/OrganisationJob/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  term: string;
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientApplyPaymentTermInitiatedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface,
    OrganisationJobAggregateIdInterface
  > {}
