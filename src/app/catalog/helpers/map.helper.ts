import {FolderModel} from '../../models/domain/folder.model';
import {CatalogEntityModel} from '../models/catalog-entity.model';
import {CatalogEntityEnum} from '../models/catalog-entity.enum';
import {ProcessModel} from '../../models/domain/process.model';
import {CatalogEntityPermissionEnum} from '../models/catalog-entity-permission.enum';

export class MapHelper {

  public static mapFoldersToEntities(folders: FolderModel[]): CatalogEntityModel[] {
    if (folders) {
      return folders.map((folder: FolderModel): CatalogEntityModel => {
        return {
          id: folder.id,
          name: folder.name,
          type: CatalogEntityEnum.FOLDER,
          // TODO
          permissions: CatalogEntityPermissionEnum.READ
        };
      });
    }
    return [];
  }

  public static mapProcessesToEntities(processes: ProcessModel[]): CatalogEntityModel[] {
    if (processes) {
      return processes.map((process: ProcessModel): CatalogEntityModel => {
        return {
          id: process.id,
          name: process.name,
          type: CatalogEntityEnum.FILE,
          // TODO
          permissions: CatalogEntityPermissionEnum.READ
        };
      });
    }
    return [];
  }

}
