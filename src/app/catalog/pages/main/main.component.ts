import {Component} from '@angular/core';
import {CatalogFolderModel} from '../../models/folder.model';
import {ContentHelper} from '../../helpers/content.helper';
import {TableColumnsModel} from '../../../shared/components/np-table/models/table.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {TableDataTypeEnum} from '../../../shared/components/np-table/models/table-data-type.enum';

enum TableColumnName {
  NAME = 'name',
  PARTICIPANTS = 'participants',
  LAST_UPDATED = 'lastUpdated',
  STATUS = 'status',
  ACTIONS = 'actions'
}

@Component({
  selector: 'np-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public mainFolders: CatalogFolderModel[] = ContentHelper.catalogMainFolders;
  public tableDisplayedColumns: TableColumnsModel[] = [
    {text: 'common.entityName', name: TableColumnName.NAME, width: 'auto', type: TableDataTypeEnum.FILE},
    {text: 'common.participants', name: TableColumnName.PARTICIPANTS, width: '25%', type: TableDataTypeEnum.PARTICIPANTS},
    {text: 'common.lastUpdated', name: TableColumnName.LAST_UPDATED, width: '15%', type: TableDataTypeEnum.DATE},
    {text: 'common.status', name: TableColumnName.STATUS, width: '12.5%', type: TableDataTypeEnum.STATUS},
    {text: '', name: TableColumnName.ACTIONS, width: '50px', type: TableDataTypeEnum.ACTIONS},
  ];
  public recentFiles: CatalogEntityModel[] = ContentHelper.getCatalogRecentFiles(10);

}
