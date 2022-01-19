import {createSelector} from '@ngxs/store';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {MapHelper} from '../../helpers/map.helper';
import {FolderState} from './folder.state';
import {FolderModel} from '../../../models/domain/folder.model';
import {Dictionary} from '@ngxs-labs/entity-state/lib/internal';
import {FoldersSelectorsHelper} from './folders-selectors.helper';

export class FolderSelectors {

  public static subFoldersInFolder(folderId): (entities: FolderModel[]) => CatalogEntityModel[] {
    return createSelector([FolderState.entities], (entities: FolderModel[]): CatalogEntityModel[] => {
      return FoldersSelectorsHelper
            .filterFoldersByFolderId(entities, folderId)
            .map(MapHelper.mapFolderToCatalogEntity);
    });
  }

  public static folderById(folderId: string): (foldersMap: Dictionary<FolderModel>) => FolderModel {
    return createSelector([FolderState.entitiesMap], (foldersMap: Dictionary<FolderModel>) => {
      return foldersMap[folderId];
    });
  }

  public static catalogEntityByFolderId(folderId: string): (foldersMap: Dictionary<FolderModel>) => CatalogEntityModel {
    return createSelector([FolderState.entitiesMap], (foldersMap: Dictionary<FolderModel>) => {
      const folder = foldersMap[folderId];
      return folder ? MapHelper.mapFolderToCatalogEntity(folder) : undefined;
    });
  }
}
