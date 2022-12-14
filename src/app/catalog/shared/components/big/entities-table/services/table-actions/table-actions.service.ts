import {Injectable} from '@angular/core';
import {TableActionModel} from '../../models/table-action.model';
import {CatalogEntityActionEnum} from '../../models/catalog-entity-action.enum';
import {AppRouteEnum} from '../../../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../../models/catalog-route.enum';
import {Router} from '@angular/router';
import {CreateEntityModalComponent} from '../../../../modals/create-entity-modal/component/create-entity-modal.component';
import {ModalInjectableEntityModel} from '../../../../../../../models/modal-injectable-entity.model';
import {MatDialog} from '@angular/material/dialog';
import {CatalogEntityModel} from '../../../../../../models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../../models/catalog-entity.enum';
import {MapHelper} from '../../../../../../helpers/map.helper';
import {RenameEntityModalComponent} from '../../../../modals/rename-entity-modal/component/rename-entity-modal.component';
import {FolderModel} from '../../../../../../../models/domain/folder.model';
import {GrantAccessModalComponent} from '../../../../modals/grant-access-modal/component/grant-access-modal.component';
import {BehaviorSubject} from 'rxjs';
import {EntitiesTabService} from '../../../../../../services/entities-tab/entities-tab.service';

@Injectable({
  providedIn: 'root'
})
export class TableActionsService {

  public renameLoader = new BehaviorSubject<string>(undefined);

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private entitiesTabService: EntitiesTabService
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
          this.dialog.open(GrantAccessModalComponent, {
            width: '700px',
            autoFocus: false,
            data: entity.original
          });
        }
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entity: CatalogEntityModel, parentFolder?: FolderModel, ssCb?: () => void) => {
          this.openRenameEntityModal({
            entity: MapHelper.mapEntityToProcess(entity),
            type: CatalogEntityEnum.PROCESS,
            parent: parentFolder,
            ssCb,
            asyncLoader: this.renameLoader
          } as ModalInjectableEntityModel);
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
        name: CatalogEntityActionEnum.RENAME,
        cb: (entity: CatalogEntityModel, parentFolder: FolderModel, ssCb?: () => void) => {
          this.openRenameEntityModal({
            entity: MapHelper.mapEntityToFolder(entity),
            type: CatalogEntityEnum.FOLDER,
            parent: parentFolder,
            ssCb,
            asyncLoader: this.renameLoader
          } as ModalInjectableEntityModel);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_FOLDER,
        cb: (entity: CatalogEntityModel) => {
          this.openCreateEntityModal({
            parent: MapHelper.mapEntityToFolder(entity),
            type: CatalogEntityEnum.FOLDER
          } as ModalInjectableEntityModel);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_PROCESS,
        cb: (entity: CatalogEntityModel) => {
          this.openCreateEntityModal({
            parent: MapHelper.mapEntityToProcess(entity),
            type: CatalogEntityEnum.PROCESS,
            openCreatedInstance: true
          } as ModalInjectableEntityModel);
        }
      },
      {
        name: CatalogEntityActionEnum.DELETE,
        class: 'danger'
      }
    ];
  }

  public openProcess(entity: CatalogEntityModel): void {
    this.entitiesTabService.tryToOpenEntity(entity.original);
  }

  public openFolder(entity: CatalogEntityModel): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
  }

  public openCreateEntityModal(data: ModalInjectableEntityModel): void {
    this.dialog.open(CreateEntityModalComponent, {
      id: 'create-entity-modal',
      width: '700px',
      autoFocus: false,
      data
    });
  }

  public openRenameEntityModal(data: ModalInjectableEntityModel): void {
    this.dialog.open(RenameEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data
    });
  }

}
