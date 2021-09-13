import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {MatRippleHelper} from '../../../../../catalog/helpers/mat-ripple.helper';
import {FolderModel} from '../../../../../models/domain/folder.model';
import {CatalogEntityActionEnum} from '../models/catalog-entity-action.enum';

@Component({
  selector: 'np-entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.scss']
})
export class EntitiesTableComponent implements OnInit {
  @Input() displayedColumns: TableColumnsModel[];
  @Input() tableClass: string;
  @Input() parentFolder: FolderModel;
  @Output() entityRenamed = new EventEmitter<void>();
  @Output() entityDeleted = new EventEmitter<CatalogEntityModel>();

  public rippleLightColor = MatRippleHelper.lightRippleColor;

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
  public processActions: TableActionModel[];
  public folderActions: TableActionModel[];
  public entityPermission = CatalogEntityPermissionEnum;
  public entityTableColumnName = EntityTableColumnName;

  ngOnInit(): void {
    this.processActions = this.tableActionsService.processActions;
    this.folderActions = this.tableActionsService.folderActions;
    this.addDeleteCallback();
  }

  private addDeleteCallback() {
   const deleteAction:TableActionModel = this.folderActions
     .find(({name}: TableActionModel) => name === CatalogEntityActionEnum.DELETE);

   deleteAction.cb = (value?: any, parent?: FolderModel, ssCb?: () => void) => {
      this.entityDeleted.emit(value);
   }
  }

  public openItem(item: CatalogEntityModel): void {
    if (item.type === CatalogEntityEnum.FOLDER) {
      this.tableActionsService.openFolder(item);
    } else if (item.type === CatalogEntityEnum.PROCESS) {
      this.tableActionsService.openProcess(item);
    }
  }

  public entityRenamedSsCb = () => {
    this.entityRenamed.emit();
  }

}
