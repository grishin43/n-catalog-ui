import {Component, Input} from '@angular/core';
import {TableColumnsModel} from '../models/table.model';
import {MatTableDataSource} from '@angular/material/table';
import {TableDataTypeEnum} from '../models/table-data-type.enum';
import {CatalogEntityModel} from '../../../../catalog/models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../catalog/models/catalog-entity.enum';
import {TableActionModel} from '../models/table-action.model';
import {NpStatusPillEnum} from '../../np-status-pill/models/np-status-pill.enum';
import {TableHelper} from '../../../../catalog/helpers/table.helper';

@Component({
  selector: 'np-table',
  templateUrl: './np-table.component.html',
  styleUrls: ['./np-table.component.scss']
})
export class NpTableComponent {
  @Input() displayedColumns: TableColumnsModel[];

  @Input() set data(value: CatalogEntityModel[] | any) {
    this.dataSource = new MatTableDataSource(value);
  }

  public dataSource = new MatTableDataSource<any>();
  public tableDataType = TableDataTypeEnum;
  public catalogEntityType = CatalogEntityEnum;
  public statuses = NpStatusPillEnum;

  public fileActions: TableActionModel[] = TableHelper.fileActions;
  public folderActions: TableActionModel[] = TableHelper.folderActions;

}
