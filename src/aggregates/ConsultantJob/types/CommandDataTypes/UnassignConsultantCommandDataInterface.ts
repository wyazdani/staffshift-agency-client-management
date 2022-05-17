export interface UnassignConsultantCommandDataInterface {
  _id: string;
  consultant_id: string;
  consultant_role_id?: string;
  client_ids?: string[];
}
