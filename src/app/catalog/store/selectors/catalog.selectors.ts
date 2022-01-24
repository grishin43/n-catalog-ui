import {CatalogState} from '../states/catalog.state';
import {createSelector, Selector} from '@ngxs/store';
import {CatalogStateModel} from '../models/catalog-state.model';
import {FolderState} from '../folder/folder.state';
import {ProcessSelectors} from '../process/process.selectors';
import {FolderModel} from '../../../models/domain/folder.model';
import {CurrentProcessModel} from '../../models/current-process.model';
import {FolderSelectors} from '../folder/folder.selectors';
import {ProcessState} from '../process/process.state';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ResourceModel} from '../../../models/domain/resource.model';
import {ProcessVersionModel} from '../../../models/domain/process-version.model';

export class CatalogSelectors {
  @Selector([CatalogState])
  static currentProcess(state: CatalogStateModel): CurrentProcessModel {
    return state.currentProcess;
  }

  @Selector([CatalogState])
  static currentProcessVersions(state: CatalogStateModel): ProcessVersionModel[] {
    return state.currentProcess?.versions;
  }

  @Selector([CatalogState])
  static currentProcessId(state: CatalogStateModel): string {
    return state.currentProcess.id;
  }

  @Selector([CatalogState])
  static currentProcessActiveResource(state: CatalogStateModel): ResourceModel {
    return state.currentProcess.activeResource;
  }

  @Selector([CatalogState])
  static currentProcessForApi(state: CatalogStateModel): CurrentProcessModel {
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
  static recentProcesses(state: CatalogStateModel): CurrentProcessModel[] {
    return state.recentProcesses;
  }

  @Selector([CatalogState])
  static mainFolders(state: CatalogStateModel): FolderModel[] {
    return state.mainFolders;
  }

  public static folderChildren(folderId: string): (allFolders: FolderModel[], allProcesses: CurrentProcessModel[]) => CatalogEntityModel[] {
    return createSelector([FolderState.entities, ProcessState.entities], (
      allFolders: FolderModel[],
      allProcesses: CurrentProcessModel[]
    ) => {
      const folders = FolderSelectors.subFoldersInFolder(folderId)(allFolders);
      const processes = ProcessSelectors.processesInFolder(folderId)(allProcesses);
      return folders.concat(processes);
    });
  }

}
