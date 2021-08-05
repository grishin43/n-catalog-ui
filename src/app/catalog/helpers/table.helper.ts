import {TableColumnsModel} from '../../shared/components/big/entities-table/models/table.model';
import {TableDataTypeEnum} from '../../shared/components/big/entities-table/models/table-data-type.enum';

export enum EntityTableColumnName {
  NAME = 'name',
  PARTICIPANTS = 'participants',
  LAST_UPDATED = 'lastUpdated',
  STATUS = 'status',
  ACTIONS = 'actions',
  PATH = 'path',
  PERMISSIONS = 'permissions'
}

export class TableHelper {

  public static getEntitiesTableColumns(showLocation?: boolean): TableColumnsModel[] {
    const columns = [
      {text: 'common.entityName', name: EntityTableColumnName.NAME, width: 'auto', type: TableDataTypeEnum.PROCESS},
      {text: 'common.permissions', name: EntityTableColumnName.PERMISSIONS, width: '15%', type: TableDataTypeEnum.TRANSLATION},
      {text: 'common.lastUpdated', name: EntityTableColumnName.LAST_UPDATED, width: '15%', type: TableDataTypeEnum.DATE},
      {text: 'common.status', name: EntityTableColumnName.STATUS, width: 'calc(175px - 50px + 16px)', type: TableDataTypeEnum.STATUS},
      {text: '', name: EntityTableColumnName.ACTIONS, width: '50px', type: TableDataTypeEnum.ACTIONS},
    ];
    if (showLocation) {
      columns.splice(
        1,
        0,
        {text: 'common.location', name: EntityTableColumnName.PATH, width: '15%', type: TableDataTypeEnum.TEXT});
    }
    return columns;
  }

}
