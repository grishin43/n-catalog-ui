import {SearchModel} from './search.model';
import {CurrentProcessModel} from '../../catalog/models/current-process.model';
import {EntityPathModel} from './entity-path.model';

export enum FolderFieldKey {
  FOLDERS = 'folders',
  PROCESSES = 'processes'
}

export interface FolderModel {
  id?: string;
  name?: string;
  icon?: string;
  parent?: FolderModel;
  [FolderFieldKey.FOLDERS]?: SearchModel<FolderModel>;
  [FolderFieldKey.PROCESSES]?: SearchModel<CurrentProcessModel>;
  root?: boolean;
  path?: EntityPathModel[];
  updatedAt?: Date;
  toBeDeleted?: boolean;
}
