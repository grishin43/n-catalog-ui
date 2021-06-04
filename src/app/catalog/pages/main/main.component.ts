import {Component} from '@angular/core';
import {CatalogFolderModel} from '../../models/folder.model';
import {ContentHelper} from '../../helpers/content.helper';
import {TableColumnsModel} from '../../../shared/components/np-table/models/table.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {TableHelper} from '../../helpers/table.helper';

@Component({
  selector: 'np-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public mainFolders: CatalogFolderModel[] = ContentHelper.catalogMainFolders;
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.entitiesTableColumns;
  public recentFiles: CatalogEntityModel[] = ContentHelper.getCatalogEntities(10);

}
