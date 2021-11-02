export interface ResourceModel {
  id?: string;
  processId?: string; // reference which added on FE side to easy mapping
  type?: string;
  content?: string;
}
