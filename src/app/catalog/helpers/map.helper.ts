import {FolderFieldKey, FolderModel} from '../../models/domain/folder.model';
import {CatalogEntityModel} from '../models/catalog-entity.model';
import {CatalogEntityEnum} from '../models/catalog-entity.enum';
import {ProcessModel} from '../../models/domain/process.model';
import {CatalogEntityPermissionEnum} from '../models/catalog-entity-permission.enum';
import {NpStatusPillEnum} from '../../shared/components/small/np-status-pill/models/np-status-pill.enum';
import {GeneralSearchItem} from '../services/search/general-search-item';

export class MapHelper {

  public static mapFoldersToEntities(folders: FolderModel[]): CatalogEntityModel[] {
    if (folders) {
      return folders.map((folder: FolderModel): CatalogEntityModel => {
        return {
          id: folder.id,
          name: folder.name,
          type: CatalogEntityEnum.FOLDER,
          permissions: CatalogEntityPermissionEnum.EDITOR,
          original: folder,
          icon: folder.icon,
          hasSubFolders: !!folder[FolderFieldKey.FOLDERS]?.count,
          hasProcesses: !!folder[FolderFieldKey.PROCESSES]?.count
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
          type: CatalogEntityEnum.PROCESS,
          permissions: CatalogEntityPermissionEnum.EDITOR,
          link: process.url,
          original: process,
          status: NpStatusPillEnum.DRAFT
        };
      });
    }
    return [];
  }

  public static mapEntityToFolder(entity: CatalogEntityModel): FolderModel {
    if (entity) {
      return {
        id: entity.id,
        name: entity.name
      };
    }
    return undefined;
  }

  public static mapEntityToProcess(entity: CatalogEntityModel): ProcessModel {
    if (entity) {
      return {
        id: entity.id,
        name: entity.name
      };
    }
    return undefined;
  }


  public static mapSearchToCatalogModel(entity: GeneralSearchItem): CatalogEntityModel {
    if (entity) {


      const permissions =
        entity.permissionLevel?.code === 'owner' ? CatalogEntityPermissionEnum.EDITOR :
        entity.permissionLevel?.code === 'viewer' ? CatalogEntityPermissionEnum.VIEWER :
        CatalogEntityPermissionEnum.NO_PERMISSIONS

      return {
        id: entity.id,
        name: entity.name,
        type: (entity.type === 'folder')? CatalogEntityEnum.FOLDER : CatalogEntityEnum.PROCESS,
        lastUpdated: new Date(entity.lastUpdatedAt),
        permissions,
        status: entity.status?.code
      } as CatalogEntityModel;
    }
    return undefined;
  }

}
