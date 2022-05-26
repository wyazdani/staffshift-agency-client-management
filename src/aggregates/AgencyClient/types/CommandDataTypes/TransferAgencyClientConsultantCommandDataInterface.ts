export interface TransferAgencyClientConsultantCommandDataInterface {
  /* the client consultant assignment id of source */
  from_id: string;
  /* the client consultant assignment id of destination */
  to_id: string;
  to_consultant_role_id: string;
  to_consultant_id: string;
}
