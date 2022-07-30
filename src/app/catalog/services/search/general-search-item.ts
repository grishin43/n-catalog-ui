export interface GeneralSearchItem {
  currentUserPermissionLevel: GeneralSearchItemPermissionLevel;
  hasSubFolders: boolean;
  id: string;
  name: string;
  type: string;
}

export interface GeneralSearchItemPermissionLevel {
  code: string;
  description: string;
}
