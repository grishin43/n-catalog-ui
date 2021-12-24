import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ApiService} from '../../../../services/api/api.service';
import {Store} from '@ngxs/store';
import {ProcessActions} from '../../../../store/process/process.actions';
import {UiNotificationCheck} from '../../../../../models/domain/ui-notification.check';
import {CreateProcessVersionModel} from '../../../../../models/domain/process-version.model';
import {AppRouteEnum} from '../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../models/catalog-route.enum';
import {Router} from '@angular/router';
import {EntitiesTabService} from '../../../../services/entities-tab/entities-tab.service';
import {ProcessModel} from '../../../../../models/domain/process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiService,
    private store: Store,
    private router: Router,
    private entitiesTab: EntitiesTabService
  ) {
  }

  /**
   * Send request to delete process.
   * @param parentFolderId - ...
   * @param processId - id of folder with should be deleted
   */
  public deleteProcess(parentFolderId: string, processId: string): Observable<any> {
    return this.apiService.deleteProcess(parentFolderId, processId)
      .pipe(
        tap(() => {
          this.store.dispatch(new ProcessActions.ProcessDeleted(processId));
        }));
  }

  public createProcess(parentFolderId: string, processType: string, name: string): Observable<UiNotificationCheck> {
    return this.apiService.createProcess(parentFolderId, processType, name);
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<UiNotificationCheck> {
    return this.apiService.renameProcess(parentFolderId, processId, name)
      .pipe(
        tap(() => this.entitiesTab.patchEntityName(parentFolderId, processId, name)),
        tap(() => this.store.dispatch(new ProcessActions.ProcessRenamed(processId, name)))
      );
  }

  public createNewVersion(parentId: string, processId: string, cpv: CreateProcessVersionModel): Observable<UiNotificationCheck> {
    return this.apiService.createNewVersion(parentId, processId, cpv);
  }

  public createVersionBasedOnPrevious(folderId: string, processId: string, previousVersionID: string, generation: number)
    : Observable<UiNotificationCheck> {
    return this.apiService.createBasedOnPreviousVersion(folderId, processId, previousVersionID, generation);
  }

  public discardVersionChanges(parentId: string, processId: string, generation: number): void {
    this.apiService.discardChanges(parentId, processId, generation).toPromise();
  }

  public openCreatedProcess(processId: string, processName: string, parentFolder: string): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
      {
        queryParams: {
          [CatalogRouteEnum._ID]: processId,
          [CatalogRouteEnum._NAME]: processName,
          [CatalogRouteEnum._PARENT_ID]: parentFolder
        }
      }
    );
  }

  public get isLocked(): boolean {
    return this.apiService.requestedProcess?.isLocked;
  }

}

