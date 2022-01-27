import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
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
import {CurrentProcessModel} from '../../../../models/current-process.model';
import {CatalogActions} from '../../../../store/actions/catalog.actions';
import {HttpStatusCodeEnum} from '../../../../../models/http-status-code.enum';
import {SearchModel} from '../../../../../models/domain/search.model';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {CatalogSelectors} from '../../../../store/selectors/catalog.selectors';
import {ResourceTypeEnum} from '../../../../../models/domain/resource-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../../../../toast/service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  @SelectSnapshot(CatalogSelectors.currentProcess) process: CurrentProcessModel;

  public loader$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiService,
    private store: Store,
    private router: Router,
    private entitiesTab: EntitiesTabService,
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  /**
   * Send request to delete process.
   * @param parentFolderId - ...
   * @param processId - id of folder with should be deleted
   */
  public deleteProcess(parentFolderId: string, processId: string): Promise<any> {
    // optimistic update
    return this.apiService.deleteProcess(parentFolderId, processId)
      .pipe(
        catchError((err) => {
          console.log('delete folder error, revert delete', err);
          return this.store.dispatch(new ProcessActions.ProcessRevertToBeDeleted(processId));
        }),
        tap(() => {
          this.store.dispatch(new ProcessActions.ProcessDeleted(processId));
        })
      )
      .toPromise();
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
    this.store.dispatch(new CatalogActions.BlockProcess());
    const loaderTitle = this.translate.instant('loaders.createVersion', {name});
    this.toast.showLoader(loaderTitle);
    this.store.dispatch(new CatalogActions.ProcessActiveResourceXmlContentPatched(content));
    this.store.dispatch(new CatalogActions.ProcessResourcePatched(content, ResourceTypeEnum.XML));
    const process: CurrentProcessModel = this.store.selectSnapshot(CatalogSelectors.currentProcessForApi);
    return this.apiService.createNewVersion(process.parent.id, process.id, {
      versionTitle: name,
      versionDescription: desc,
      resources: process.resources.map(({processId, ...resource}) => resource),
      generation: process.generation
    })
      .pipe(
        tap((nc: UiNotificationCheck) => this.store.dispatch(new CatalogActions.ProcessGenerationPatched(nc.parameters?.generation))),
        tap(() => this.toast.close()),
        tap(() => this.store.dispatch(new CatalogActions.UnblockProcess()))
      );
  }

  public discardVersionChanges(parentId: string, processId: string, generation: number, shouldSaved?: boolean): void {
    if (shouldSaved) {
      this.discardVersionChangesCb(parentId, processId);
    } else {
      this.loader$.next(true);
      this.store.dispatch(new CatalogActions.BlockProcess());
      this.apiService.discardChanges(parentId, processId, generation).toPromise()
        .then(() => {
          this.discardVersionChangesCb(parentId, processId);
          this.store.dispatch(new CatalogActions.UnblockProcess());
        });
    }
  }

  private discardVersionChangesCb(parentId: string, processId: string): void {
    if (this.process.currentVersionId) {
      this.getProcessVersionById(parentId, processId, this.process.currentVersionId).toPromise();
    } else {
      this.getProcessById(parentId, processId).toPromise();
    }
    this.store.dispatch(new CatalogActions.ProcessDiscardChangesPatched(false));
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

  public getProcessById(folderId: string, processId: string): Observable<CurrentProcessModel> {
    this.loader$.next(true);
    return this.apiService.getProcessById(folderId, processId)
      .pipe(
        tap((p: CurrentProcessModel) => this.store.dispatch(new CatalogActions.ProcessFetched(p))),
        tap((p: CurrentProcessModel) => this.entitiesTab.addEntity(p)),
        tap(() => this.loader$.next(false)),
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

  public getProcessVersionById(folderId: string, processId: string, versionId: string): Observable<CurrentProcessModel> {
    this.loader$.next(true);
    return this.apiService.getVersionById(folderId, processId, versionId)
      .pipe(
        tap((p: CurrentProcessModel) => this.store.dispatch(new CatalogActions.ProcessFetched(p))),
        tap(() => this.store.dispatch(new CatalogActions.ProcessDiscardChangesPatched(false))),
        tap(() => this.loader$.next(false))
      );
  }

  public saveProcess(content: string): Observable<UiNotificationCheck> {
    this.store.dispatch(new CatalogActions.ProcessActiveResourceXmlContentPatched(content));
    this.store.dispatch(new CatalogActions.ProcessResourcePatched(content, ResourceTypeEnum.XML));
    this.store.dispatch(new CatalogActions.BlockProcess());
    return this.apiService.saveProcess(this.store.selectSnapshot(CatalogSelectors.currentProcessForApi))
      .pipe(
        tap((nc: UiNotificationCheck) => this.store.dispatch(new CatalogActions.ProcessGenerationPatched(nc.parameters?.generation))),
        tap(() => this.store.dispatch(new CatalogActions.UnblockProcess())),
      );
  }

  public getVersions(folderId: string, processId: string): Observable<SearchModel<ProcessVersionModel>> {
    return this.apiService.getVersions(folderId, processId)
      .pipe(
        tap((sm: SearchModel<ProcessVersionModel>) => {
          this.store.dispatch(new CatalogActions.ProcessVersionsPatched(sm.items));
        })
      );
  }

}

