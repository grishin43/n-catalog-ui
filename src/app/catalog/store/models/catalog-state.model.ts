import {CurrentProcessModel} from '../../models/current-process.model';
import {FolderModel} from '../../../models/domain/folder.model';

export interface CatalogStateModel {
  recentProcesses?: CurrentProcessModel[];
  mainFolders?: FolderModel[];
  currentProcess?: CurrentProcessModel;
}
