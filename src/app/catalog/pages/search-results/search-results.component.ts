import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Subscription} from 'rxjs';
import {SearchService} from '../../services/search/search.service';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';

@Component({
  selector: 'np-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public query: string;
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.entitiesTableColumns;

  private subscriptions = new Subscription();

  constructor(
    private activateRoute: ActivatedRoute,
    public searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeRouteParams(): void {
    this.subscriptions.add(
      this.activateRoute.params.subscribe((params: Params) => {
        this.query = params[CatalogRouteEnum._QUERY];
      })
    );
  }

}
