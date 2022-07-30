import {FolderModel} from './folder.model';
import {ResourceModel} from './resource.model';
import {EntityPermissionLevelEnum} from '../../catalog/models/entity-permission-level.enum';

export interface ProcessModel {
  id?: string;
  name?: string;
  ownerUsername?: string;
  origin?: string;
  parent?: FolderModel;
  path?: FolderModel[];
  resources?: ResourceModel[];
  url?: string;
  subRoot?: string;
  activeResource?: ResourceModel;
  currentUserPermissionLevel?: ProcessPermissionLevelModel;
  generation?: number;
  lockedBy?: string;
  companyID?: string;
  ownerId?: string;
  toBeDeleted?: boolean; // local field
}

export interface ProcessPermissionLevelModel {
  code: EntityPermissionLevelEnum;
  description: string;
}
