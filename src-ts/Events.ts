import _ from 'lodash';
interface KeyValue {
  [key: string]: String;
}
const events = {
  AGENCY_CONSULTANT_ROLE_ADDED: {
    name: 'AgencyConsultantRoleAdded',
    description: 'The Agency Consultant Role has been created'
  },
  AGENCY_CONSULTANT_ROLE_ENABLED: {
    name: 'AgencyConsultantRoleEnabled',
    description: 'The Agency Consultant Role has been enabled'
  },
  AGENCY_CONSULTANT_ROLE_DISABLED: {
    name: 'AgencyConsultantRoleDisabled',
    description: 'The Agency Consultant Role has been disabled'
  },
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED: {
    name: 'AgencyConsultantRoleDetailsUpdated',
    description: 'The Agency Consultant Role has been updated'
  },
  AGENCY_CLIENT_CONSULTANT_ASSIGNED: {
    name: 'AgencyClientConsultantAssigned',
    description: 'The Agency Client Consultant has been assigned'
  },
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED: {
    name: 'AgencyClientConsultantUnassigned',
    description: 'The Agency Client Consultant has been unassigned'
  },
  AGENCY_CLIENT_LINKED: {
    name: 'AgencyClientLinked',
    description: 'The Agency Client was linked'
  },
  AGENCY_CLIENT_UNLINKED: {
    name: 'AgencyClientUnLinked',
    description: 'The Agency Client was unlinked, does not indicate a deletion'
  }
};
export const Events : KeyValue = _.reduce(events, (result: KeyValue, value, key) => {
  result[key] = value.name;
  return result;
}, {});
