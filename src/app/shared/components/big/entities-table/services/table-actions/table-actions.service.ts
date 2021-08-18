import {Injectable} from '@angular/core';
import {TableActionModel} from '../../models/table-action.model';
import {CatalogEntityActionEnum} from '../../models/catalog-entity-action.enum';
import {AppRouteEnum} from '../../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../../catalog/models/catalog-route.enum';
import {Router} from '@angular/router';
import {CreateEntityModalComponent} from '../../../create-entity-modal/component/create-entity-modal.component';
import {ModalInjectableDataModel} from '../../../../../../models/modal-injectable-data.model';
import {MatDialog} from '@angular/material/dialog';
import {CatalogEntityModel} from '../../../../../../catalog/models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../../catalog/models/catalog-entity.enum';
import {MapHelper} from '../../../../../../catalog/helpers/map.helper';
import {RenameEntityModalComponent} from '../../../rename-entity-modal/component/rename-entity-modal.component';
import {FolderModel} from '../../../../../../models/domain/folder.model';
import {ApiService} from '../../../../../../catalog/services/api/api.service';
import {ToastService} from '../../../../../../catalog/services/toast/toast.service';
import {EntitiesTabService} from '../../../../../../catalog/services/entities-tab/entities-tab.service';

@Injectable({
  providedIn: 'root'
})
export class TableActionsService {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService,
    private toast: ToastService,
    private entitiesTab: EntitiesTabService
  ) {
  }

  public get processActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entity: CatalogEntityModel) => {
          this.openProcess(entity);
        }
      }, {
        name: CatalogEntityActionEnum.PROVIDE_ACCESS,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        },
        disabled: true
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entity: CatalogEntityModel, parentFolder?: FolderModel, ssCb?: () => void) => {
          this.openRenameEntityModal({
            entity: MapHelper.mapEntityToProcess(entity),
            type: CatalogEntityEnum.PROCESS,
            parent: parentFolder,
            ssCb
          } as ModalInjectableDataModel);
        }
      },
      {
        name: CatalogEntityActionEnum.COPY,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        },
        disabled: true
      },
      {
        name: CatalogEntityActionEnum.DELETE,
        cb: (entity: CatalogEntityModel, parentFolder?: FolderModel, ssCb?: () => void) => {
          this.api.deleteProcess(parentFolder.id, entity.id)
            .subscribe(() => {
              this.entitiesTab.deleteEntity({id: entity.id});
              this.toast.show('common.processDeletedSuccessfully', 1500, undefined, 'bottom', 'right');
              if (typeof ssCb === 'function') {
                ssCb();
              }
            });
        },
        class: 'danger'
      }
    ];
  }

  public get folderActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entity: CatalogEntityModel) => {
          this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
        }
      },
      {
        name: CatalogEntityActionEnum.PROVIDE_ACCESS,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        },
        disabled: true
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entity: CatalogEntityModel, parentFolder: FolderModel, ssCb?: () => void) => {
          this.openRenameEntityModal({
            entity: MapHelper.mapEntityToFolder(entity),
            type: CatalogEntityEnum.FOLDER,
            ssCb
          } as ModalInjectableDataModel);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_FOLDER,
        cb: (entity: CatalogEntityModel) => {
          this.openCreateEntityModal({
            parent: MapHelper.mapEntityToFolder(entity),
            type: CatalogEntityEnum.FOLDER
          } as ModalInjectableDataModel);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_PROCESS,
        cb: (entity: CatalogEntityModel) => {
          this.openCreateEntityModal({
            parent: MapHelper.mapEntityToProcess(entity),
            type: CatalogEntityEnum.PROCESS
          } as ModalInjectableDataModel);
        }
      },
      {
        name: CatalogEntityActionEnum.DELETE,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        },
        class: 'danger',
        disabled: true
      }
    ];
  }

  public openProcess(entity: CatalogEntityModel): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
      {
        queryParams: {
          [CatalogRouteEnum._ID]: entity.id,
          [CatalogRouteEnum._NAME]: entity.name,
          [CatalogRouteEnum._PARENT_ID]: entity.original.parent.id
        }
      }
    );
  }

  public openFolder(entity: CatalogEntityModel): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
  }

  public openCreateEntityModal(data: ModalInjectableDataModel): void {
    this.dialog.open(CreateEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data
    });
  }

  public openRenameEntityModal(data: ModalInjectableDataModel): void {
    this.dialog.open(RenameEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data
    });
  }

}
