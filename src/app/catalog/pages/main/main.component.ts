import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {TableHelper} from '../../helpers/table.helper';
import {Subscription} from 'rxjs';
import {SearchService} from '../../services/search/search.service';
import {ApiService} from '../../services/api/api.service';
import {SearchModel} from '../../../models/domain/search.model';
import {FolderModel} from '../../../models/domain/folder.model';

@Component({
  selector: 'np-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns(true);
  public recentProcesses: CatalogEntityModel[];
  public rootFolders: FolderModel[];
  public loader: boolean;
  public loaderHelper = new Array(4);

  private subscription = new Subscription();

  constructor(
    private apiService: ApiService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.recentProcesses = this.searchService.savedEntities;
    this.getChapters();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getChapters(): void {
    this.loader = true;
    this.subscription.add(
      this.apiService.getRootFoldersWithSubs()
        .subscribe((res: SearchModel<FolderModel>) => {
          this.loader = false;
          this.rootFolders = res.items;
        }, () => {
          this.loader = false;
        })
    );
  }

}
