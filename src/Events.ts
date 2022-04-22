export enum EventsEnum {
  AGENCY_CONSULTANT_ROLE_ADDED = 'AgencyConsultantRoleAdded',
  AGENCY_CONSULTANT_ROLE_ENABLED = 'AgencyConsultantRoleEnabled',
  AGENCY_CONSULTANT_ROLE_DISABLED = 'AgencyConsultantRoleDisabled',
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED = 'AgencyConsultantRoleDetailsUpdated',
  AGENCY_CLIENT_CONSULTANT_ASSIGNED = 'AgencyClientConsultantAssigned',
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED = 'AgencyClientConsultantUnassigned',
  AGENCY_CLIENT_LINKED = 'AgencyClientLinked',
  AGENCY_CLIENT_UNLINKED = 'AgencyClientUnLinked',
  AGENCY_CLIENT_SYNCED = 'AgencyClientSynced',
  CONSULTANT_JOB_ASSIGN_INITIATED = 'ConsultantJobAssignInitiated',
  CONSULTANT_JOB_ASSIGN_COMPLETED = 'ConsultantJobAssignCompleted',
  CONSULTANT_JOB_PROCESS_STARTED = 'ConsultantJobProcessStarted',
  CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED = 'ConsultantJobProcessItemSucceeded',
  CONSULTANT_JOB_PROCESS_ITEM_FAILED = 'ConsultantJobProcessItemFailed',
  CONSULTANT_JOB_PROCESS_COMPLETED = 'ConsultantJobProcessCompleted'
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
  },
  [EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED]: {
    name: 'ConsultantJobAssignInitiated',
    description: 'Initiate a job to assign a consultant to multiple clients for an agency'
  },
  [EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED]: {
    name: 'ConsultantJobAssignCompleted',
    description: 'Job assigning a consultant to multiple clients for an agency has completed'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_STARTED]: {
    name: 'ConsultantJobProcessStarted',
    description: 'Background process for consultant job is started'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED]: {
    name: 'ConsultantJobProcessItemSucceeded',
    description: 'Background process for consultant job is succeeded for one client'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_FAILED]: {
    name: 'ConsultantJobProcessItemFailed',
    description: 'Background process for consultant job is failed for one client'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_COMPLETED]: {
    name: 'ConsultantJobProcessCompleted',
    description: 'Background process for consultant job is completed'
  }
};
