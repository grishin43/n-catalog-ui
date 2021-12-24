import {FolderModel} from './folder.model';
import {ResourceModel} from './resource.model';
import {ProcessPermission} from './process-permission';

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
  currentUserPermissionLevel?: ProcessPermission;
  generation?: number;
  lockedBy?: string;
}

