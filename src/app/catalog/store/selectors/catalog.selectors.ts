import {CatalogState} from '../states/catalog.state';
import {createSelector, Selector} from '@ngxs/store';
import {CatalogStateModel} from '../models/catalog-state.model';
import {FolderState} from '../folder/folder.state';
import {ProcessSelectors} from '../process/process.selectors';
import {FolderModel} from '../../../models/domain/folder.model';
import {ProcessModel} from '../../../models/domain/process.model';
import {FolderSelectors} from '../folder/folder.selectors';
import {ProcessState} from '../process/process.state';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ResourceModel} from '../../../models/domain/resource.model';

export class CatalogSelectors {
  @Selector([CatalogState])
  static currentProcess(state: CatalogStateModel): ProcessModel {
    return state.currentProcess;
  }

  @Selector([CatalogState])
  static currentProcessForApi(state: CatalogStateModel): ProcessModel {
    return {
      ...state.currentProcess,
      resources: state.currentProcess.resources.map(({processId, ...resource}) => resource)
    };
  }

  @Selector([CatalogState])
  static currentProcessVersionId(state: CatalogStateModel): string {
    return state.currentProcess?.currentVersionId;
  }

  @Selector([CatalogState])
  static recentProcesses(state: CatalogStateModel): ProcessModel[] {
    return state.recentProcesses;
  }

  @Selector([CatalogState])
  static mainFolders(state: CatalogStateModel): FolderModel[] {
    return state.mainFolders;
  }

  public static folderChildren(folderId: string): (allFolders: FolderModel[], allProcesses: ProcessModel[]) => CatalogEntityModel[] {
    return createSelector([FolderState.entities, ProcessState.entities], (
      allFolders: FolderModel[],
      allProcesses: ProcessModel[]
    ) => {
      const folders = FolderSelectors.subFoldersInFolder(folderId)(allFolders);
      const processes = ProcessSelectors.processesInFolder(folderId)(allProcesses);
      return folders.concat(processes);
    });
  }

}
