import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StorageEnum} from '../../../models/storageEnum';
import {LocalStorageHelper} from '../../../helpers/localStorageHelper';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Router} from '@angular/router';
import {ProcessModel} from '../../../models/domain/process.model';
import {ToastService} from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class EntitiesTabService {
  public processes: BehaviorSubject<ProcessModel[]>;
  public readonly limit = 20;

  constructor(
    private router: Router,
    private toast: ToastService
  ) {
  }

  public addEntity(entity: ProcessModel): void {
    if (this.processes.getValue().length === this.limit) {
      this.deleteEarliestEntity(entity);
    } else {
      this.addNewEntity(entity);
    }
  }

  public deleteEntity(entity: ProcessModel): void {
    const entitiesValue: ProcessModel[] = this.processes.getValue();
    const removeIndex = entitiesValue.map(item => item.id).indexOf(entity.id);
    if (removeIndex !== -1) {
      entitiesValue.splice(removeIndex, 1);
    }
    this.processes.next(entitiesValue);
    LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, entitiesValue);
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.MAIN}`]);
  }

  private deleteEarliestEntity(entity: ProcessModel): void {
    const currentValue: ProcessModel[] = this.processes.getValue();
    const removeIndex = currentValue.map(item => item.id).indexOf(entity.id);
    if (removeIndex !== -1) {
      currentValue.splice(removeIndex, 1);
      currentValue.unshift(entity);
      LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, currentValue);
      // TODO
      this.toast.show('common.tabsOverflowed', 3000, 'OK');
    }
  }

  private addNewEntity(entity: ProcessModel): void {
    if (entity) {
      const matchIndex = this.processes.getValue().map(item => item.id).indexOf(entity.id);
      if (matchIndex === -1) {
        const newValue = [{
          id: entity.id,
          name: entity.name,
          parent: entity.parent
        } as ProcessModel, ...this.processes.getValue() || []];
        this.processes.next(newValue);
        LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, newValue);
      }
    }
  }

  public init(): void {
    this.processes = new BehaviorSubject(LocalStorageHelper.getData(StorageEnum.PROCESSES_TABS) || []);
  }

}
