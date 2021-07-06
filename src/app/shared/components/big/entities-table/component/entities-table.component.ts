import {Component, Input} from '@angular/core';
import {TableColumnsModel} from '../models/table.model';
import {MatTableDataSource} from '@angular/material/table';
import {TableDataTypeEnum} from '../models/table-data-type.enum';
import {CatalogEntityModel} from '../../../../../catalog/models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {TableActionModel} from '../models/table-action.model';
import {NpStatusPillEnum} from '../../../small/np-status-pill/models/np-status-pill.enum';
import {Router} from '@angular/router';
import {CatalogEntityActionEnum} from '../models/catalog-entity-action.enum';
import {AppRouteEnum} from '../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../catalog/models/catalog-route.enum';

@Component({
  selector: 'np-entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.scss']
})
export class EntitiesTableComponent {
  @Input() displayedColumns: TableColumnsModel[];

  @Input() set data(value: CatalogEntityModel[] | any) {
    this.dataSource = new MatTableDataSource(value);
  }

  constructor(
    private router: Router
  ) {
  }

  public dataSource = new MatTableDataSource<any>();
  public tableDataType = TableDataTypeEnum;
  public catalogEntityType = CatalogEntityEnum;
  public statuses = NpStatusPillEnum;

  public fileActions: TableActionModel[] = [
    {
      name: CatalogEntityActionEnum.OPEN,
      cb: (entityId: string) => {
        this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${entityId}`]);
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

  public folderActions: TableActionModel[] = [
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
