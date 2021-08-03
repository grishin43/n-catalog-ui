import {SearchModel} from './search.model';
import {ProcessModel} from './process.model';

export interface FolderModel {
  id?: string;
  name?: string;
  icon?: string;
  parent?: FolderModel;
  folders?: SearchModel<FolderModel>;
  definitions?: SearchModel<ProcessModel>;
  root?: boolean;
}
