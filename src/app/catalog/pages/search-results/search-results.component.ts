import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Observable, Subscription} from 'rxjs';
import {SearchService} from '../../services/search/search.service';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {map, tap} from 'rxjs/operators';
import {MapHelper} from '../../helpers/map.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {GeneralSearchItem} from '../../services/search/general-search-item';
import {SearchType} from '../../services/search/search-type.enum';

@Component({
  selector: 'np-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public query: string;
  public searchType: SearchType = SearchType.all;
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns();
  public searchResult$: Observable<CatalogEntityModel[]>

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
    // switch map
    this.subscriptions.add(
      this.activateRoute.params.subscribe((params: Params) => {
        this.query = params[CatalogRouteEnum._QUERY];
        this.searchType = params[CatalogRouteEnum._TYPE] || SearchType.all;
        this.fetchGeneralSearchResults();
      })
    );
  }

  private fetchGeneralSearchResults() {
    // map to TableColumnsModel as easy please in service
    this.searchResult$ = this.searchService.generalSearch(this.query, this.searchType).pipe(
      tap((parsed) => console.log('not parsed data', parsed)),
      tap((parsed) => console.log('not parsed pppp', this.mapToCatalogEntities(parsed.foundItems))),
      map((data) =>
        data.totalFoundItems ? this.mapToCatalogEntities(data.foundItems) : []
      ),
      tap((parsed) => console.log('parsed data', parsed))
    );
  }

  private mapToCatalogEntities(results: GeneralSearchItem[]): CatalogEntityModel[] {
    console.log('try to parse foundItems', results);
    console.log('try to parse map res', results.map(item => MapHelper.mapSearchToCatalogModel(item)));
    return results.map(item => MapHelper.mapSearchToCatalogModel(item));

  }

}
