import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableColumnsModel} from '../models/table.model';
import {MatTableDataSource} from '@angular/material/table';
import {TableDataTypeEnum} from '../models/table-data-type.enum';
import {CatalogEntityModel} from '../../../../../models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../models/catalog-entity.enum';
import {TableActionModel} from '../models/table-action.model';
import {NpStatusPillEnum} from '../../../general/np-status-pill/models/np-status-pill.enum';
import {TableActionsService} from '../services/table-actions/table-actions.service';
import {EntityPermissionLevelEnum} from '../../../../../models/entity-permission-level.enum';
import {EntityTableColumnName} from '../../../../../helpers/table.helper';
import {MatRippleHelper} from '../../../../../helpers/mat-ripple.helper';
import {FolderModel} from '../../../../../../models/domain/folder.model';
import {CatalogEntityActionEnum} from '../models/catalog-entity-action.enum';
import {MatDialog} from '@angular/material/dialog';
import {RequestAccessModalComponent} from '../../../modals/request-access-modal/component/request-access-modal.component';
import {ProcessModel} from '../../../../../../models/domain/process.model';

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
  public entityPermission = EntityPermissionLevelEnum;
  public entityTableColumnName = EntityTableColumnName;

  ngOnInit(): void {
    this.processActions = this.tableActions.processActions;
    this.folderActions = this.tableActions.folderActions;
    this.addDeleteCallback(this.processActions);
    this.addDeleteCallback(this.folderActions);
  }

  private addDeleteCallback(actions: TableActionModel[]): void {
    const deleteAction: TableActionModel = actions
      .find(({name}: TableActionModel) => name === CatalogEntityActionEnum.DELETE);
    deleteAction.cb = (value?: any, parent?: FolderModel, ssCb?: () => void) => {
      this.entityDeleted.emit(value);
    };
  }

  public openItem(item: CatalogEntityModel): void {
    if (item.permissions !== EntityPermissionLevelEnum.NO_ACCESS) {
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
      data: (entity?.original as ProcessModel)?.ownerId
    });
  }

}
