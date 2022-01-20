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
import {MatDialog} from '@angular/material/dialog';
import {RequestAccessModalComponent} from '../../request-access-modal/component/request-access-modal.component';

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
  public eCatalogEntityAction = CatalogEntityActionEnum;
  public dateObject = Date;

  @Input() set data(value: CatalogEntityModel[] | any) {
    this.dataSource = new MatTableDataSource(value);
  }

  constructor(
    public tableActions: TableActionsService,
    private dialog: MatDialog
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
    this.processActions = this.tableActions.processActions;
    this.folderActions = this.tableActions.folderActions;
    this.addDeleteCallback();
  }

  private addDeleteCallback(): void {
    const deleteAction: TableActionModel = this.folderActions
      .find(({name}: TableActionModel) => name === CatalogEntityActionEnum.DELETE);

    deleteAction.cb = (value?: any, parent?: FolderModel, ssCb?: () => void) => {
      this.entityDeleted.emit(value);
    };
  }

  public openItem(item: CatalogEntityModel): void {
    if (item.permissions !== CatalogEntityPermissionEnum.NO_ACCESS) {
      if (item.type === CatalogEntityEnum.FOLDER) {
        this.tableActions.openFolder(item);
      } else if (item.type === CatalogEntityEnum.PROCESS) {
        this.tableActions.openProcess(item);
      }
    }
  }

  public entityRenamedSsCb = () => {
    this.entityRenamed.emit();
  };

  public requestEntityTemplate(entity: CatalogEntityModel): void {
    this.dialog.open(RequestAccessModalComponent, {
      width: '700px',
      autoFocus: false,
      data: entity?.original?.ownerUsername
    });
  }

}
