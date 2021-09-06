export enum AgencyClientEventType {
  AGENCY_CLIENT_CONSULTANT_ASSIGNED = 'AgencyClientConsultantAssigned',
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED = 'AgencyClientConsultantUnassigned',
  AGENCY_CLIENT_LINKED = 'AgencyClientLinked',
  AGENCY_CLIENT_UNLINKED = 'AgencyClientUnLinked'
}

export enum AgencyClientCommandEnum {
  LINK_AGENCY_CLIENT = 'linkAgencyClient',
  UNLINK_AGENCY_CLIENT = 'unlinkAgencyClient',
  ADD_AGENCY_CLIENT_CONSULTANT = 'addAgencyClientConsultant',
  REMOVE_AGENCY_CLIENT_CONSULTANT = 'removeAgencyClientConsultant'
}