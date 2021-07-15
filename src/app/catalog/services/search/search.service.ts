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
    this.entities$.next(this.savedEntities);
  }

  public get savedEntities(): CatalogEntityModel[] {
    return LocalStorageHelper.getData(StorageEnum.SEARCHED_ENTITIES) || [];
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

  private saveEntities(entities: CatalogEntityModel[]): void {
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

  private navigateToSearchResults(queryStr: string): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.SEARCH_RESULTS}/${queryStr}`]);
  }

}
