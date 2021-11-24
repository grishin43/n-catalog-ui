export interface VersionModel {
  author: string;
  createdAt: Date;
  description: string;
  title: string;
  versionID: string;
}

export interface ProcessVersionModel extends VersionModel{
  launched?: boolean;
  active?: boolean;
}
