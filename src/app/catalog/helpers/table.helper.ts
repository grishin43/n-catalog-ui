import {TableColumnsModel} from '../../shared/components/np-table/models/table.model';
import {TableDataTypeEnum} from '../../shared/components/np-table/models/table-data-type.enum';
import {TableActionModel} from '../../shared/components/np-table/models/table-action.model';
import {CatalogEntityActionEnum} from '../../shared/components/np-table/models/catalog-entity-action.enum';

enum EntityTableColumnName {
  NAME = 'name',
  PARTICIPANTS = 'participants',
  LAST_UPDATED = 'lastUpdated',
  STATUS = 'status',
  ACTIONS = 'actions'
}

export class TableHelper {

  public static get entitiesTableColumns(): TableColumnsModel[] {
    return [
      {text: 'common.entityName', name: EntityTableColumnName.NAME, width: 'auto', type: TableDataTypeEnum.FILE},
      {text: 'common.participants', name: EntityTableColumnName.PARTICIPANTS, width: '25%', type: TableDataTypeEnum.PARTICIPANTS},
      {text: 'common.lastUpdated', name: EntityTableColumnName.LAST_UPDATED, width: '15%', type: TableDataTypeEnum.DATE},
      {text: 'common.status', name: EntityTableColumnName.STATUS, width: '12.5%', type: TableDataTypeEnum.STATUS},
      {text: '', name: EntityTableColumnName.ACTIONS, width: '50px', type: TableDataTypeEnum.ACTIONS},
    ];
  }

  public static get fileActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entityId: string) => {
          console.log(entityId);
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

  public static get folderActions(): TableActionModel[] {
    return [
      {
        name: CatalogEntityActionEnum.OPEN,
        cb: (entityId: string) => {
          console.log(entityId);
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

}
