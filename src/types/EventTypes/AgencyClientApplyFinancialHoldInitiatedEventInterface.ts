import {BaseEventStoreDataInterface} from 'EventTypes';
import {OrganisationJobAggregateIdInterface} from '../../aggregates/OrganisationJob/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface AgencyClientApplyFinancialHoldInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  note: string;
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientApplyFinancialHoldInitiatedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientApplyFinancialHoldInitiatedEventStoreDataInterface,
    OrganisationJobAggregateIdInterface
  > {}
