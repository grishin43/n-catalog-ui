import {createSelector} from '@ngxs/store';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {MapHelper} from '../../helpers/map.helper';
import {FolderState} from './folder.state';
import {FolderModel} from '../../../models/domain/folder.model';
import {Dictionary} from '@ngxs-labs/entity-state/lib/internal';

export class FolderSelectors {
  static subFoldersInFolder(folderId) {
    return createSelector([FolderState.entities], (entities: FolderModel[]): CatalogEntityModel[] => {
      return entities.filter((folder: FolderModel) => {
        // hide folders witch have to be deleted
        return !folder.toBeDeleted && folder.parent?.id === folderId;
      }).map(MapHelper.mapFolderToCatalogEntity);
    })
  }

  static folderById(folderId: string) {
    return createSelector([FolderState.entitiesMap], (foldersMap: Dictionary<FolderModel>) => {
      return foldersMap[folderId];
    });
  }

  static catalogEntityByFolderId(folderId: string) {
    return createSelector([FolderState.entitiesMap], (foldersMap: Dictionary<FolderModel>) => {
      const folder = foldersMap[folderId];
      return folder ? MapHelper.mapFolderToCatalogEntity(folder) : undefined ;
    });
  }
}
