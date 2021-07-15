import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {StorageEnum} from '../../../models/storageEnum';
import {LocalStorageHelper} from '../../../helpers/localStorageHelper';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EntitiesTabService {
  public entities: BehaviorSubject<CatalogEntityModel[]>;
  public readonly limit = 20;

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) {
  }

  public addEntity(entity: CatalogEntityModel): void {
    if (this.entities.getValue().length === this.limit) {
      this.deleteEarliestEntity(entity);
    } else {
      this.addNewEntity(entity);
    }
  }

  public deleteEntity(entity: CatalogEntityModel): void {
    const entitiesValue: CatalogEntityModel[] = this.entities.getValue();
    const removeIndex = entitiesValue.map(item => item.id).indexOf(entity.id);
    if (removeIndex !== -1) {
      entitiesValue.splice(removeIndex, 1);
    }
    this.entities.next(entitiesValue);
    LocalStorageHelper.setData(StorageEnum.FILE_TABS, entitiesValue);
    if (entitiesValue[removeIndex + 1]) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${entitiesValue[removeIndex + 1].id}`]);
    } else if (entitiesValue[removeIndex - 1]) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${entitiesValue[removeIndex - 1].id}`]);
    } else {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.MAIN}`]);
    }
  }

  private deleteEarliestEntity(entity: CatalogEntityModel): void {
    const currentValue: CatalogEntityModel[] = this.entities.getValue();
    const removeIndex = currentValue.map(item => item.id).indexOf(entity.id);
    if (removeIndex !== -1) {
      currentValue.splice(removeIndex, 1);
      currentValue.unshift(entity);
      LocalStorageHelper.setData(StorageEnum.FILE_TABS, currentValue);
      // TODO
      this.snackBar.open(this.translateService.instant('common.tabsOverflowed'), 'OK');
    }
  }

  private addNewEntity(entity: CatalogEntityModel): void {
    if (entity) {
      const matchIndex = this.entities.getValue().map(item => item.id).indexOf(entity.id);
      if (matchIndex === -1) {
        const newValue = [{
          id: entity.id,
          name: entity.name
        } as CatalogEntityModel, ...this.entities.getValue() || []];
        this.entities.next(newValue);
        LocalStorageHelper.setData(StorageEnum.FILE_TABS, newValue);
      }
    }
  }

  public init(): void {
    this.entities = new BehaviorSubject(LocalStorageHelper.getData(StorageEnum.FILE_TABS) || []);
  }

}
