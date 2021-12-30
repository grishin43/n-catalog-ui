import {ProcessModel} from '../../../models/domain/process.model';
import {FolderModel} from '../../../models/domain/folder.model';

export interface CatalogStateModel {
  recentProcesses?: ProcessModel[];
  mainFolders?: FolderModel[];
  currentProcess?: ProcessModel;
}
