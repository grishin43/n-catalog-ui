import {Injectable} from '@angular/core';
import {TableActionModel} from '../../models/table-action.model';
import {CatalogEntityActionEnum} from '../../models/catalog-entity-action.enum';
import {AppRouteEnum} from '../../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../../catalog/models/catalog-route.enum';
import {Router} from '@angular/router';
import {CreateEntityModalComponent} from '../../../create-entity-modal/component/create-entity-modal.component';
import {InjectableDataModel} from '../../../create-entity-modal/models/injectable-data.model';
import {MatDialog} from '@angular/material/dialog';
import {CatalogEntityModel} from '../../../../../../catalog/models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../../catalog/models/catalog-entity.enum';

@Injectable({
  providedIn: 'root'
})
export class TableActionsService {

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  public get fileActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entity: CatalogEntityModel) => {
          this.openFile(entity);
        }
      }, {
        name: CatalogEntityActionEnum.PROVIDE_ACCESS,
        cb: (entity: CatalogEntityModel) => {
          this.openFile(entity);
        }
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        }
      },
      {
        name: CatalogEntityActionEnum.COPY,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        }
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
        }
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_FOLDER,
        cb: (entity: CatalogEntityModel) => {
          this.dialog.open(CreateEntityModalComponent, {
            width: '700px',
            autoFocus: false,
            data: {
              parent: entity,
              type: CatalogEntityEnum.FOLDER
            } as InjectableDataModel
          });
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_FILE,
        cb: (entity: CatalogEntityModel) => {
          console.log(entity);
        }
      }
    ];
  }

  public openFile(entity: CatalogEntityModel): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}`],
      {queryParams: {[CatalogRouteEnum._ID]: entity.id}}
    );
  }

  public openFolder(entity: CatalogEntityModel): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
  }

}
