import {Component} from '@angular/core';
import {TableColumnsModel} from '../../../shared/components/np-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ContentHelper} from '../../helpers/content.helper';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.entitiesTableColumns;
  public folderEntities: CatalogEntityModel[] = ContentHelper.getCatalogEntities(10);
}
