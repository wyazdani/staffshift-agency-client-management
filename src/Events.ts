export enum EventsEnum {
  AGENCY_CONSULTANT_ROLE_ADDED = 'AgencyConsultantRoleAdded',
  AGENCY_CONSULTANT_ROLE_ENABLED = 'AgencyConsultantRoleEnabled',
  AGENCY_CONSULTANT_ROLE_DISABLED = 'AgencyConsultantRoleDisabled',
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED = 'AgencyConsultantRoleDetailsUpdated',
  AGENCY_CLIENT_CONSULTANT_ASSIGNED = 'AgencyClientConsultantAssigned',
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED = 'AgencyClientConsultantUnassigned',
  AGENCY_CLIENT_LINKED = 'AgencyClientLinked',
  AGENCY_CLIENT_UNLINKED = 'AgencyClientUnLinked',
  AGENCY_CLIENT_SYNCED = 'AgencyClientSynced'
}

type EventsType = {
  [key in EventsEnum]: {name: string; description: string};
};

export const events: EventsType = {
  [EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED]: {
    name: 'AgencyConsultantRoleAdded',
    description: 'The Agency Consultant Role has been created'
  },
  [EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED]: {
    name: 'AgencyConsultantRoleEnabled',
    description: 'The Agency Consultant Role has been enabled'
  },
  [EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED]: {
    name: 'AgencyConsultantRoleDisabled',
    description: 'The Agency Consultant Role has been disabled'
  },
  [EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED]: {
    name: 'AgencyConsultantRoleDetailsUpdated',
    description: 'The Agency Consultant Role has been updated'
  },
  [EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED]: {
    name: 'AgencyClientConsultantAssigned',
    description: 'The Agency Client Consultant has been assigned'
  },
  [EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED]: {
    name: 'AgencyClientConsultantUnassigned',
    description: 'The Agency Client Consultant has been unassigned'
  },
  [EventsEnum.AGENCY_CLIENT_LINKED]: {
    name: 'AgencyClientLinked',
    description: 'The Agency Client was linked'
  },
  [EventsEnum.AGENCY_CLIENT_UNLINKED]: {
    name: 'AgencyClientUnLinked',
    description: 'The Agency Client was unlinked, does not indicate a deletion'
  },
  [EventsEnum.AGENCY_CLIENT_SYNCED]: {
    name: 'AgencyClientSynced',
    description: 'Sync event to move data from legacy application to microservice'
  }
};
