import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface AgencyClientConsultantAssignedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_role_id: string;
  consultant_id: string;
}
