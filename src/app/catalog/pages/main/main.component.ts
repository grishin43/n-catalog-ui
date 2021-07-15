import {Component, OnInit} from '@angular/core';
import {ContentHelper} from '../../helpers/content.helper';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {TableHelper} from '../../helpers/table.helper';
import {ApiService} from '../../services/api/api.service';
import {Observable} from 'rxjs';
import {SearchService} from '../../services/search/search.service';

@Component({
  selector: 'np-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public mainFolders$: Observable<CatalogEntityModel[]>;
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.entitiesTableColumns;
  public recentFiles: CatalogEntityModel[];

  constructor(
    private apiService: ApiService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.mainFolders$ = this.apiService.getRootFolders();
    this.recentFiles = this.searchService.savedEntities;
  }

}

