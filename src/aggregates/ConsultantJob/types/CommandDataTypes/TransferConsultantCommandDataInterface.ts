export interface TransferConsultantCommandDataInterface {
  _id: string;
  from_consultant_id: string;
  to_consultant_id: string;
  consultant_role_id?: string;
  client_ids?: string[];
}
