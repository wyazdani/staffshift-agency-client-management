import {BaseEventStoreDataInterface} from 'EventTypes';
import {OrganisationJobAggregateIdInterface} from '../../aggregates/OrganisationJob/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface AgencyClientApplyPaymentTermInheritanceInitiatedDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientApplyPaymentTermInheritanceInitiatedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientApplyPaymentTermInheritanceInitiatedDataInterface,
    OrganisationJobAggregateIdInterface
  > {}
