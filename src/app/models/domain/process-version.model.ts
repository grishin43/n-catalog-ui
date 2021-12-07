import {ResourceModel} from './resource.model';

export interface VersionModel {
  author: string;
  changedAt: Date;
  description: string;
  title: string;
  versionID?: string;
}

export interface ProcessVersionModel extends VersionModel{
  launched?: boolean;
  active?: boolean;
}

export interface CreateProcessVersionModel {
  versionTitle: string;
  versionDescription: string;
  resources: ResourceModel[];
}
