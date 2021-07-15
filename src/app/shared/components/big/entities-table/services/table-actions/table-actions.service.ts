import {Injectable} from '@angular/core';
import {TableActionModel} from '../../models/table-action.model';
import {CatalogEntityActionEnum} from '../../models/catalog-entity-action.enum';
import {AppRouteEnum} from '../../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../../catalog/models/catalog-route.enum';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableActionsService {

  constructor(
    private router: Router
  ) {
  }

  public get fileActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entityId: string) => {
          this.openFile(entityId);
        }
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entityId: string) => {
          console.log(entityId);
        }
      },
      {
        name: CatalogEntityActionEnum.COPY,
        cb: (entityId: string) => {
          console.log(entityId);
        }
      }
    ];
  }

  public get folderActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entityId: string) => {
          this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entityId}`]);
        }
      },
      {
        name: CatalogEntityActionEnum.RENAME,
        cb: (entityId: string) => {
          console.log(entityId);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_FOLDER,
        cb: (entityId: string) => {
          console.log(entityId);
        }
      },
      {
        name: CatalogEntityActionEnum.CREATE_FILE,
        cb: (entityId: string) => {
          console.log(entityId);
        }
      }
    ];
  }

  public openFile(entityId: string): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${entityId}`]);
  }

  public openFolder(entityId: string): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entityId}`]);
  }

}
