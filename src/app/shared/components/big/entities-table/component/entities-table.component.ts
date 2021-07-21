import {Component, Input, OnInit} from '@angular/core';
import {TableColumnsModel} from '../models/table.model';
import {MatTableDataSource} from '@angular/material/table';
import {TableDataTypeEnum} from '../models/table-data-type.enum';
import {CatalogEntityModel} from '../../../../../catalog/models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {TableActionModel} from '../models/table-action.model';
import {NpStatusPillEnum} from '../../../small/np-status-pill/models/np-status-pill.enum';
import {TableActionsService} from '../services/table-actions/table-actions.service';
import {CatalogEntityPermissionEnum} from '../../../../../catalog/models/catalog-entity-permission.enum';
import {EntityTableColumnName} from '../../../../../catalog/helpers/table.helper';

@Component({
  selector: 'np-entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.scss']
})
export class EntitiesTableComponent implements OnInit {
  @Input() displayedColumns: TableColumnsModel[];
  @Input() tableClass: string;

  @Input() set data(value: CatalogEntityModel[] | any) {
    this.dataSource = new MatTableDataSource(value);
  }

  constructor(
    private tableActionsService: TableActionsService
  ) {
  }

  public dataSource = new MatTableDataSource<any>();
  public tableDataType = TableDataTypeEnum;
  public catalogEntityType = CatalogEntityEnum;
  public statuses = NpStatusPillEnum;
  public fileActions: TableActionModel[];
  public folderActions: TableActionModel[];
  public entityPermission = CatalogEntityPermissionEnum;
  public entityTableColumnName = EntityTableColumnName;

  ngOnInit(): void {
    this.fileActions = this.tableActionsService.fileActions;
    this.folderActions = this.tableActionsService.folderActions;
  }

  public openItem(item: CatalogEntityModel): void {
    if (item.permissions === this.entityPermission.READ || item.permissions === this.entityPermission.EDIT) {
      if (item.type === CatalogEntityEnum.FOLDER) {
        this.tableActionsService.openFolder(item.id);
      } else if (item.type === CatalogEntityEnum.FILE) {
        this.tableActionsService.openFile(item.id);
      }
    }
  }

}
