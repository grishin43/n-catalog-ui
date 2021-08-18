import {FolderModel} from './folder.model';
import {ResourceModel} from './resource.model';

export interface ProcessModel {
  id?: string;
  name?: string;
  origin?: string;
  parent?: FolderModel;
  path?: FolderModel[];
  resources?: ResourceModel[];
  url?: string;
  subRoot?: string;
  activeResource?: ResourceModel;
}

