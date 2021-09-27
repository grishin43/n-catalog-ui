import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {LocalStorageHelper} from '../../../helpers/localStorageHelper';
import {StorageEnum} from '../../../models/storageEnum';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SearchAutocompleteDto} from './searchAutocomplete.dto';
import {GeneralSearchWrapperDto} from './general-search-wrapper.dto';
import {SearchModel} from '../../../models/domain/search.model';

interface AutocompleteSearchDTO {
  value: string
}

interface GeneralSearchDTO {
  searchType: string, // all
  searchValue: string,
  pageNumber: number, // for ex 0
  pageSize: number // for ex 10
}

export interface RecentSearchDto {
  count: number
  items: ({value: string})[]
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public entities$ = new BehaviorSubject<CatalogEntityModel[]>([]);
  public readonly limit = 20;

  private recentSearchUrl = `${environment.apiV1}/search/recent`;
  private autocompleteSearchUrl = `${environment.apiV1}/search/autocomplete`;
  private generalSearchUrl = `${environment.apiV1}/search/general`;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
  ) {
    this.entities$.next(this.savedEntities);
  }

  public get savedEntities(): CatalogEntityModel[] {
    return LocalStorageHelper.getData(StorageEnum.SEARCHED_ENTITIES) || [];
  }

  public searchEntities(str: string): Observable<CatalogEntityModel[]> {
    // call real request
    return this.apiService.searchEntities(str)
      .pipe(
        tap((res: CatalogEntityModel[]) => {
          this.entities$.next(res);
          this.navigateToSearchResults(str);
          this.saveEntities(res);
        })
      );
  }

  public saveEntities(entities: CatalogEntityModel[]): void {
    if (this.savedEntities.length + entities?.length > this.limit) {
      this.handleOverflowedEntities(entities);
    } else {
      this.addEntities(entities);
    }
  }

  private addEntities(entities: CatalogEntityModel[]): void {
    LocalStorageHelper.setData(StorageEnum.SEARCHED_ENTITIES, this.handleDuplicates(entities));
  }

  private handleOverflowedEntities(entities: CatalogEntityModel[]): void {
    const newValue = this.handleDuplicates(entities);
    const diff = newValue.length - this.savedEntities.length;
    if (diff > 0) {
      newValue.splice(0, diff);
      LocalStorageHelper.setData(StorageEnum.SEARCHED_ENTITIES, newValue);
    }
  }

  private handleDuplicates(entities: CatalogEntityModel[]): CatalogEntityModel[] {
    const currentValue = this.savedEntities;
    if (currentValue.length) {
      currentValue.map((item: CatalogEntityModel) => {
        return {
          id: item.id,
          name: item.name,
          type: item.type
        } as CatalogEntityModel;
      });
      const entityIDs = new Set(currentValue.map((entity: CatalogEntityModel) => entity.id));
      return [...currentValue, ...entities.filter((entity: CatalogEntityModel) => !entityIDs.has(entity.id))];
    } else {
      return entities;
    }
  }

  public openGeneralSearchPage(query: string): void {
    this.addRecentSearchResult(query);
    this.navigateToSearchResults(query);
  }

  public navigateToSearchResults(queryStr: string): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.SEARCH_RESULTS}/${queryStr}`]);
  }

  public recentSearch$(): Observable<RecentSearchDto> {
    return this.http.get<RecentSearchDto>(this.recentSearchUrl)
      .pipe(
        tap(resentRequest => console.log('recent data ' + resentRequest)
        )
      )
  }

  public fetchAutocompleteSearchResults(query: string): Observable<SearchAutocompleteDto> {
    const searchQuery: AutocompleteSearchDTO = {
      value: query
    }
    return this.http.post<SearchAutocompleteDto>(this.autocompleteSearchUrl, searchQuery)
      .pipe(tap((result) => {
      console.log('[SearchService] fetchSearchResults: ', result);
    }));
  }

  public generalSearch(query: string): Observable<GeneralSearchWrapperDto> {
    const searchRequestParams: GeneralSearchDTO = {
      searchType: 'all',
      searchValue: query,
      pageNumber: 0,
      pageSize: 10
    }

    return this.http.post<GeneralSearchWrapperDto>(this.generalSearchUrl, searchRequestParams)
  }

  public addRecentSearchResult(query: string): Promise<any> {
    return this.http.post<AutocompleteSearchDTO>(this.recentSearchUrl, {
      value: query
    }).toPromise();
  }
}
