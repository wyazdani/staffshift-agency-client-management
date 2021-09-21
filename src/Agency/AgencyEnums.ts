export enum AgencyCommandEnum {
  ADD_AGENCY_CONSULTANT_ROLE = 'addAgencyConsultantRole',
  UPDATE_AGENCY_CONSULTANT_ROLE = 'updateAgencyConsultantRole',
  ENABLE_AGENCY_CONSULTANT_ROLE = 'enableAgencyConsultantRole',
  DISABLE_AGENCY_CONSULTANT_ROLE = 'disableAgencyConsultantRole'
}

export enum AgencyConsultantRoleEnum {
  AGENCY_CONSULTANT_ROLE_STATUS_ENABLED = 'enabled',
  AGENCY_CONSULTANT_ROLE_STATUS_DISABLED = 'disabled'
}

export enum AgencyEventEnum {
  AGENCY_CONSULTANT_ROLE_ADDED = 'AgencyConsultantRoleAdded',
  AGENCY_CONSULTANT_ROLE_ENABLED = 'AgencyConsultantRoleEnabled',
  AGENCY_CONSULTANT_ROLE_DISABLED = 'AgencyConsultantRoleDisabled',
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED = 'AgencyConsultantRoleDetailsUpdated'
}