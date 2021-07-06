import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {CookieHelper} from '../../../helpers/cookie.helper';
import {CookieEnum} from '../../../models/cookie.enum';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public entities$ = new BehaviorSubject<CatalogEntityModel[]>([]);
  public readonly limit = 20;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
  }

  public searchEntities(str: string): Observable<CatalogEntityModel[]> {
    return this.apiService.searchEntities(str)
      .pipe(
        tap((res: CatalogEntityModel[]) => {
          this.entities$.next(res);
          this.navigateToSearchResults(str);
          this.saveEntities(res);
        })
      );
  }

  public getSavedEntities(): CatalogEntityModel[] {
    return CookieHelper.getCookie(CookieEnum.SEARCHED_ENTITIES) || [];
  }

  private saveEntities(entities: CatalogEntityModel[]): void {
    if (this.getSavedEntities().length + entities?.length > this.limit) {
      this.handleOverflowedEntities(entities);
    } else {
      this.addEntities(entities);
    }
  }

  private addEntities(entities: CatalogEntityModel[]): void {
    CookieHelper.setCookie(CookieEnum.SEARCHED_ENTITIES, this.handleDuplicates(entities));
  }

  private handleOverflowedEntities(entities: CatalogEntityModel[]): void {
    const newValue = this.handleDuplicates(entities);
    const diff = newValue.length - this.getSavedEntities().length;
    if (diff > 0) {
      newValue.splice(0, diff);
      CookieHelper.setCookie(CookieEnum.SEARCHED_ENTITIES, newValue);
    }
  }

  private handleDuplicates(entities: CatalogEntityModel[]): CatalogEntityModel[] {
    const currentValue = this.getSavedEntities();
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

  private navigateToSearchResults(queryStr: string): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.SEARCH_RESULTS}/${queryStr}`]);
  }

}
