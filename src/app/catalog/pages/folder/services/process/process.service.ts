import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ApiService} from '../../../../services/api/api.service';
import {Store} from '@ngxs/store';
import {ProcessActions} from '../../../../store/process/process.actions';
import {UiNotificationCheck} from '../../../../../models/domain/ui-notification.check';
import {ProcessVersionModel} from '../../../../../models/domain/process-version.model';
import {AppRouteEnum} from '../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../models/catalog-route.enum';
import {Router} from '@angular/router';
import {EntitiesTabService} from '../../../../services/entities-tab/entities-tab.service';
import {ProcessModel} from '../../../../../models/domain/process.model';
import {CatalogActions} from '../../../../store/actions/catalog.actions';
import {HttpStatusCodeEnum} from '../../../../../models/http-status-code.enum';
import {SearchModel} from '../../../../../models/domain/search.model';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {CatalogSelectors} from '../../../../store/selectors/catalog.selectors';
import {ResourceTypeEnum} from '../../../../../models/domain/resource-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  @SelectSnapshot(CatalogSelectors.currentProcess) process: ProcessModel;

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

  public createNewVersion(content: string, name: string, desc: string): Observable<UiNotificationCheck> {
    this.store.dispatch(new CatalogActions.ProcessActiveResourceXmlContentPatched(content));
    this.store.dispatch(new CatalogActions.ProcessResourcePatched(content, ResourceTypeEnum.XML));
    const process: ProcessModel = this.store.selectSnapshot(CatalogSelectors.currentProcessForApi);
    return this.apiService.createNewVersion(process.parent.id, process.id, {
      versionTitle: name,
      versionDescription: desc,
      resources: process.resources.map(({processId, ...resource}) => resource),
      generation: process.generation
    })
      .pipe(
        tap((nc: UiNotificationCheck) => this.store.dispatch(new CatalogActions.ProcessGenerationPatched(nc.parameters?.generation)))
      );
  }

  public createVersionBasedOnPrevious(folderId: string, processId: string, previousVersionID: string, generation: number)
    : Observable<UiNotificationCheck> {
    return this.apiService.createBasedOnPreviousVersion(folderId, processId, previousVersionID, generation);
  }

  public discardVersionChanges(parentId: string, processId: string, generation: number): void {
    this.apiService.discardChanges(parentId, processId, generation).toPromise()
      .then(() => this.getProcessById(parentId, processId).toPromise());
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

  public getProcessById(folderId: string, processId: string): Observable<ProcessModel> {
    return this.apiService.getProcessById(folderId, processId)
      .pipe(
        tap((p: ProcessModel) => this.store.dispatch(new CatalogActions.ProcessFetched(p))),
        tap((p: ProcessModel) => this.entitiesTab.addEntity(p)),
        catchError((err: any) => {
          if (err instanceof Response) {
            if (err.status === HttpStatusCodeEnum.NOT_FOUND) {
              this.entitiesTab.deleteEntity({id: processId});
            }
          }
          return throwError(err);
        })
      );
  }

  public getProcessVersionById(folderId: string, processId: string, versionId: string): Observable<ProcessModel> {
    return this.apiService.getVersionById(folderId, processId, versionId)
      .pipe(
        tap((p: ProcessModel) => this.store.dispatch(new CatalogActions.ProcessFetched(p)))
      );
  }

  public saveProcess(content: string): Observable<UiNotificationCheck> {
    this.store.dispatch(new CatalogActions.ProcessActiveResourceXmlContentPatched(content));
    this.store.dispatch(new CatalogActions.ProcessResourcePatched(content, ResourceTypeEnum.XML));
    return this.apiService.saveProcess(this.store.selectSnapshot(CatalogSelectors.currentProcessForApi))
      .pipe(
        tap((nc: UiNotificationCheck) => this.store.dispatch(new CatalogActions.ProcessGenerationPatched(nc.parameters?.generation)))
      );
  }

  public getVersions(folderId: string, processId: string): Observable<SearchModel<ProcessVersionModel>> {
    return this.apiService.getVersions(folderId, processId)
      .pipe(
        tap((sm: SearchModel<ProcessVersionModel>) => {
          this.store.dispatch(new CatalogActions.ProcessVersionsAvailabilityPatched(!!sm.count));
        })
      );
  }

}

