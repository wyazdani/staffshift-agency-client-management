
export enum Events {
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

const events = {
  [Events.AGENCY_CONSULTANT_ROLE_ADDED]: {
    name: 'AgencyConsultantRoleAdded',
    description: 'The Agency Consultant Role has been created'
  },
  [Events.AGENCY_CONSULTANT_ROLE_ENABLED]: {
    name: 'AgencyConsultantRoleEnabled',
    description: 'The Agency Consultant Role has been enabled'
  },
  [Events.AGENCY_CONSULTANT_ROLE_DISABLED]: {
    name: 'AgencyConsultantRoleDisabled',
    description: 'The Agency Consultant Role has been disabled'
  },
  [Events.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED]: {
    name: 'AgencyConsultantRoleDetailsUpdated',
    description: 'The Agency Consultant Role has been updated'
  },
  [Events.AGENCY_CLIENT_CONSULTANT_ASSIGNED]: {
    name: 'AgencyClientConsultantAssigned',
    description: 'The Agency Client Consultant has been assigned'
  },
  [Events.AGENCY_CLIENT_CONSULTANT_UNASSIGNED]: {
    name: 'AgencyClientConsultantUnassigned',
    description: 'The Agency Client Consultant has been unassigned'
  },
  [Events.AGENCY_CLIENT_LINKED]: {
    name: 'AgencyClientLinked',
    description: 'The Agency Client was linked'
  },
  [Events.AGENCY_CLIENT_UNLINKED]: {
    name: 'AgencyClientUnLinked',
    description: 'The Agency Client was unlinked, does not indicate a deletion'
  },
  [Events.AGENCY_CLIENT_SYNCED]: {
    name: 'AgencyClientSynced',
    description: 'Sync event to move data from legacy application to microservice'
  }
};