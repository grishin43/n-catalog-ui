import {TableColumnsModel} from '../../shared/components/big/entities-table/models/table.model';
import {TableDataTypeEnum} from '../../shared/components/big/entities-table/models/table-data-type.enum';
import {TableActionModel} from '../../shared/components/big/entities-table/models/table-action.model';
import {CatalogEntityActionEnum} from '../../shared/components/big/entities-table/models/catalog-entity-action.enum';
import {Router} from '@angular/router';
import {AppRouteEnum} from '../../models/app-route.enum';
import {CatalogRouteEnum} from '../models/catalog-route.enum';

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

}
