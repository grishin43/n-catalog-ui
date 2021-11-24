import {CatalogState} from '../states/catalog.state';
import {createSelector, Selector} from '@ngxs/store';
import {CatalogStateModel} from '../models/catalog-state.model';
import {FolderState} from '../folder/folder.state';
import {ProcessSelectors} from '../process/process.selectors';
import {FolderModel} from '../../../models/domain/folder.model';
import {ProcessModel} from '../../../models/domain/process.model';
import {FolderSelectors} from '../folder/folder.selectors';
import {ProcessState} from '../process/process.state';

export class CatalogSelectors {
  @Selector([CatalogState])
  static recentProcesses(state: CatalogStateModel): any {
    return state.recentProcesses;
  }

  @Selector([CatalogState])
  static mainFolders(state: CatalogStateModel): any {
    return state.mainFolders;
  }

  static folderChildren(folderId: string) {
    return createSelector([FolderState.entities, ProcessState.entities], (
      allFolders: FolderModel[],
      allProcesses: ProcessModel[]
      ) => {
        const folders = FolderSelectors.subFoldersInFolder(folderId)(allFolders);
        const processes = ProcessSelectors.processesInFolder(folderId)(allProcesses);
        return folders.concat(processes);
    })
  }
}
