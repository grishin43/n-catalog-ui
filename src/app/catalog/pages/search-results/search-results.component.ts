import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Observable, of, Subscription} from 'rxjs';
import {SearchService} from '../../services/search/search.service';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {catchError, map, tap} from 'rxjs/operators';
import {MapHelper} from '../../helpers/map.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {GeneralSearchItem} from '../../services/search/general-search-item';
import {SearchType} from '../../services/search/search-type.enum';
import {GeneralSearchWrapperDto} from '../../services/search/general-search-wrapper.dto';

@Component({
  selector: 'np-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public query: string;
  public searchType: SearchType = SearchType.all;
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns();
  public searchResult$: Observable<CatalogEntityModel[]>;
  public currentPage = 0;
  public readonly itemsPerPage = 10;
  public paginationHelperArr: any[];
  public loader: boolean;

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

  private fetchGeneralSearchResults(): void {
    // map to TableColumnsModel as easy please in service
    this.loader = true;
    this.searchResult$ = this.searchService.generalSearch(this.query, this.searchType, this.currentPage - 1, this.itemsPerPage).pipe(
      tap((data: GeneralSearchWrapperDto) => this.paginationHelperArr = new Array(data?.totalFoundItems)),
      map((data: GeneralSearchWrapperDto) =>
        data.totalFoundItems ? this.mapToCatalogEntities(data.foundItems) : []
      ),
      tap(() => this.loader = false),
      catchError((err) => {
        this.loader = false;
        return of(err);
      })
    );
  }

  private mapToCatalogEntities(results: GeneralSearchItem[]): CatalogEntityModel[] {
    return results.map(item => MapHelper.mapSearchToCatalogModel(item));
  }

  public onPageChanged(event: number): void {
    this.currentPage = event;
    this.fetchGeneralSearchResults();
  }

}
