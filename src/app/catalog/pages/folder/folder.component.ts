import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnDestroy {
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns();
  public folder$: Observable<CatalogEntityModel>;

  private subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getFolderById(id: string): void {
    this.folder$ = this.apiService.getFolderById(id);
  }

  private subscribeRouteParams(): void {
    this.subscriptions.add(
      this.activatedRoute.params
        .subscribe((params: Params) => {
          this.getFolderById(params[CatalogRouteEnum._ID]);
        })
    );
  }

}
