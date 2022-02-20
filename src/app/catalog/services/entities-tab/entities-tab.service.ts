import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StorageEnum} from '../../../models/storageEnum';
import {LocalStorageHelper} from '../../../helpers/localStorageHelper';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TabsOverflowedModalComponent} from '../../shared/components/modals/tabs-overflowed-modal/component/tabs-overflowed-modal.component';
import {Store} from '@ngxs/store';
import {CatalogActions} from '../../store/actions/catalog.actions';
import {ProcessModel} from '../../../models/domain/process.model';

@Injectable({
  providedIn: 'root'
})
export class EntitiesTabService {
  public processes: BehaviorSubject<ProcessModel[]> = new BehaviorSubject(LocalStorageHelper.getData(StorageEnum.PROCESSES_TABS) || []);
  public readonly limit = 20;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store: Store
  ) {
  }

  public tryToOpenEntity(entity: ProcessModel): void {
    const isNew = this.processes.getValue().map(item => item.id).indexOf(entity.id) === -1;
    if (this.processes.getValue().length === this.limit && isNew) {
      this.deleteEarliestEntity(entity);
    } else {
      this.addNewEntity(entity, isNew);
    }
  }

  public deleteEntity(entity: ProcessModel, noRedirect?: boolean): void {
    const entitiesValue: ProcessModel[] = this.processes.getValue();
    const removeIndex = entitiesValue.map(item => item.id).indexOf(entity.id);
    if (removeIndex !== -1) {
      entitiesValue.splice(removeIndex, 1);
      LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, entitiesValue);
      const entityToOpen = entitiesValue[removeIndex - 1] || entitiesValue[removeIndex + 1] || entitiesValue[0];
      if (!noRedirect) {
        if (entitiesValue.length >= 1 && entityToOpen && entity.parent?.id) {
          this.router.navigate(
            [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
            {
              queryParams: {
                [CatalogRouteEnum._ID]: entityToOpen.id,
                [CatalogRouteEnum._NAME]: entity.name,
                [CatalogRouteEnum._PARENT_ID]: entity.parent.id
              }
            }
          ).then(() => {
            this.processes.next(entitiesValue);
            this.store.dispatch(new CatalogActions.CurrentProcessCleared());
          });
        } else {
          this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.MAIN}`])
            .then(() => {
              this.processes.next(entitiesValue);
              this.store.dispatch(new CatalogActions.CurrentProcessCleared());
            });
        }
      }
    }
  }

  private deleteEarliestEntity(entity: ProcessModel): void {
    this.dialog.open(TabsOverflowedModalComponent, {
      width: '700px',
      autoFocus: false
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        const currentValue: ProcessModel[] = this.processes.getValue();
        currentValue.splice(currentValue.length - 1, 1);
        currentValue.unshift(entity);
        this.processes.next(currentValue);
        LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, currentValue);
        this.openProcess(entity.id, entity.name, entity.parent.id);
      }
    });
  }

  private openProcess(processId: string, processName: string, parentFolderId: string): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
      {
        queryParams: {
          [CatalogRouteEnum._ID]: processId,
          [CatalogRouteEnum._NAME]: processName,
          [CatalogRouteEnum._PARENT_ID]: parentFolderId
        }
      }
    );
  }

  private addNewEntity(entity: ProcessModel, isNew: boolean): void {
    if (entity) {
      if (isNew) {
        const newValue = [{
          id: entity.id,
          name: entity.name,
          parent: entity.parent
        } as ProcessModel, ...this.processes.getValue() || []];
        this.processes.next(newValue);
        LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, newValue);
      }
      this.openProcess(entity.id, entity.name, entity.parent.id);
    }
  }

  public patchEntityName(parentFolderId: string, processId: string, name: string): void {
    const currentValue: ProcessModel[] = this.processes.getValue();
    if (currentValue?.length) {
      currentValue.forEach((item: ProcessModel, index: number) => {
        if (item.id === processId && item.parent.id === parentFolderId) {
          currentValue[index] = {
            ...item,
            name
          };
        }
      });
      this.processes.next(currentValue);
      LocalStorageHelper.setData(StorageEnum.PROCESSES_TABS, currentValue);
    }
  }

}
