import {Injectable} from '@angular/core';
import {forkJoin, merge, Observable, of, throwError, timer} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {defaultIfEmpty, exhaustMap, filter, map, mapTo, switchMap, take, takeLast, tap} from 'rxjs/operators';
import {SearchModel} from '../../../models/domain/search.model';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {ProcessModel} from '../../../models/domain/process.model';
import {ProcessTypeModel} from '../../../models/domain/process-type.model';
import {Base64} from 'js-base64';
import {CatalogEntityPermissionEnum} from '../../models/catalog-entity-permission.enum';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {ResourceModel} from '../../../models/domain/resource.model';
import {EntitiesTabService} from '../entities-tab/entities-tab.service';
import {UserModel} from '../../../models/domain/user.model';
import {ProcessWorkgroupModel} from '../../../models/domain/process-workgroup.model';
import {PermissionLevel} from '../../../models/domain/permission-level.enum';
import {LocalSaverHelper} from '../../helpers/local-saver.helper';
import {CreateProcessVersionModel, ProcessVersionModel} from '../../../models/domain/process-version.model';
import {v4 as uuid} from 'uuid';
import {UiNotificationCheck} from '../../../models/domain/ui-notification.check';
import {CollectionWrapperDto} from '../../../models/domain/collection-wrapper.dto';
import {UiNotification} from '../../../models/domain/ui-notification';
import {environment} from '../../../../environments/environment';

enum ApiRoute {
  FOLDERS = 'folders',
  RENAME = 'rename',
  MOVE = 'move',
  PROCESSES = 'processes',
  ORIGINS = 'origins',
  RECENT_PROCESSES = 'processes/recent',
  RESOURCES = 'resources',
  SEARCH_USERS = 'search/user',
  PERMISSIONS = 'permissions',
  OWNER = 'owner',
  USERS = 'users',
  VERSIONS = 'versions',
  CREATE_BASED_ON_PREVIOUS_VERSION = 'createBasedOnPreviousVersion',
  UI_NOTIFICATIONS = 'uiNotifications',
  SAVE = 'save'
}

enum ApiHeader {
  CORRELATION_ID = 'x-correlation-id'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public requestedProcess: ProcessModel;

  private readonly ApiUrl = 'https://businesscatalogapi.bc.dev.digital.np.work/api/v1';

  public lastNotification: UiNotification;

  constructor(
    private http: HttpClient,
    private entitiesTab: EntitiesTabService
  ) {
  }

  public getRootFolders(): Observable<SearchModel<FolderModel>> {
    return this.http.get<SearchModel<FolderModel>>(`${this.ApiUrl}/${ApiRoute.FOLDERS}`);
  }

  public getRootFoldersWithSubs(): Observable<SearchModel<FolderModel>> {
    return this.getRootFolders()
      .pipe(
        exhaustMap((res: SearchModel<FolderModel>) => {
          return forkJoin(res.items.map((folder: FolderModel) => this.getFolderById(folder.id)))
            .pipe(
              defaultIfEmpty(null)
            );
        }),
        map((res: FolderModel[]): SearchModel<FolderModel> => {
          return {
            items: res,
            count: res?.length
          };
        })
      );
  }

  public createFolder(parentFolderId: string, name: string): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const body = {
      name
    };
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.post<{ name: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.FOLDERS}`,
      body,
      {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked)
      );
  }

  public getFolderByIdWithSubs(id: string): Observable<FolderModel> {
    let folder: FolderModel;
    return this.getFolderById(id)
      .pipe(
        exhaustMap((res: FolderModel) => {
          folder = res;
          return forkJoin(res[FolderFieldKey.FOLDERS].items.map((item: FolderModel) => this.getFolderById(item.id)))
            .pipe(
              defaultIfEmpty(folder as any)
            );
        }),
        map((res: FolderModel[] | FolderModel): FolderModel => {
          if ((res as FolderModel[]).length) {
            const folders = res as FolderModel[];
            return {
              ...folder,
              [FolderFieldKey.FOLDERS]: {
                count: folders.length,
                items: folders
              }
            };
          } else {
            return res as FolderModel;
          }
        })
      );
  }

  public getFolderById(id: string): Observable<FolderModel> {
    return this.http.get<FolderModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}`)
      .pipe(
        map((folder: FolderModel) => {
          return {
            ...folder,
            root: !folder.parent,
            icon: folder.icon ? Base64.decode(folder.icon) : folder.icon,
            [FolderFieldKey.PROCESSES]: {
              count: folder[FolderFieldKey.PROCESSES].count,
              items: folder[FolderFieldKey.PROCESSES]
                .items.map((process: ProcessModel) => {
                  return {
                    ...process,
                    parent: {id}
                  };
                })
            }
          };
        })
      );
  }

  public renameFolder(id: string, name: string): Observable<{ name: string }> {
    return this.http.put<{ name: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}/${ApiRoute.RENAME}`, {name});
  }

  public moveFolder(id: string, targetFolderId: string): Observable<{ folder: string }> {
    return this.http.post<{ folder: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}/${ApiRoute.MOVE}`, {folder: targetFolderId});
  }

  /**
   * Only an empty folder is allowed to be deleted.
   * When you try to delete a folder that contains other folders or processes, the response status will be 403.
   */
  public deleteFolder(id: string): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.delete<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}`, {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked)
      );
  }

  public createProcess(parentFolderId: string, processType: string, name: string): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const body = {
      origin: processType,
      name
    };
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.post<ProcessModel>(
      `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}`,
      body,
      {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked)
      );
  }

  private pendingNotificationChecked(correlationId: string): Observable<UiNotificationCheck> {
    const createDraftProcess$ = of({correlationId, isChecked: false} as UiNotificationCheck);
    const checkUiNotification$ = this.checkNotification(correlationId);
    return merge(createDraftProcess$, checkUiNotification$);
  }

  private checkNotification(correlationId: string): Observable<any> {
    const maxRetry = environment.checkNotificationMaxRetryNumber;
    return timer(0, 2000)
      .pipe(
        take(maxRetry + 1),
        switchMap((i) => {
          if (i < maxRetry) {
            return this.http.get<CollectionWrapperDto<UiNotification>>(`${this.ApiUrl}/${ApiRoute.UI_NOTIFICATIONS}`);
          } else {
            return throwError(new Error(`Max retry number ${maxRetry} for getting notification reached. Please retry later`));
          }
        }),
        filter(({items}: CollectionWrapperDto<UiNotification>) => {
          return items.some((notification) => notification.correlationID === correlationId);
        }),
        map(({items}: CollectionWrapperDto<UiNotification>) => items),
        switchMap((notifications: UiNotification[]) => {
          // TODO
          this.lastNotification = notifications.find((notification) => notification.correlationID === correlationId);
          return this.sendNotificationProcessed(this.lastNotification);
        }),
        take(1),
        map(({parameters}: UiNotification) => { return {correlationId, isChecked: true, parameters} as UiNotificationCheck})
      );
  }

  private sendNotificationProcessed(notification: UiNotification): Observable<UiNotification> {
    const lastAckNotificationNumber = notification.notificationNumber;
    return this.http.post(`${this.ApiUrl}/${ApiRoute.UI_NOTIFICATIONS}?lastAckNotificationNumber=${lastAckNotificationNumber}`, {})
      .pipe(mapTo(notification));
  }

  public deleteProcess(folderId: string, processId: string): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.delete<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`, {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked)
      );
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.put<null>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.RENAME}`,
      {name}, {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked),
        tap(() => this.entitiesTab.patchEntityName(parentFolderId, processId, name))
      );
  }

  public moveProcess(parentFolderId: string, processId: string, targetFolderId: string): Observable<{ folder: string }> {
    return this.http.post<{ folder: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.MOVE}`, {
      folder: targetFolderId
    });
  }

  public getProcessTypes(): Observable<SearchModel<ProcessTypeModel>> {
    return this.http.get<SearchModel<ProcessTypeModel>>(`${this.ApiUrl}/${ApiRoute.ORIGINS}`);
  }

  public getProcessById(folderId: string, processId: string): Observable<ProcessModel> {
    if (this.requestedProcess?.id === processId) {
      return of(this.requestedProcess);
    }
    return this.http.get<ProcessModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`)
      .pipe(
        map((res: ProcessModel) => {
          // TODO
          const mappedProcess: ProcessModel = {
            ...res,
            subRoot: res.path.length > 1
              ? res.path[res.path.length - 1].id
              : res.path[0].id,
            activeResource: res.resources.find((r: ResourceModel) => r.type === ResourceTypeEnum.XML)
          };
          if (mappedProcess.activeResource) {
            const lsResource = LocalSaverHelper.getResource(folderId, processId);
            if (lsResource?.trim()?.length) {
              const serverContent = mappedProcess.activeResource.content;
              if (serverContent?.trim() === lsResource?.trim()) {
                LocalSaverHelper.deleteResource(folderId, processId);
              } else {
                mappedProcess.activeResource.content = lsResource;
              }
            }
          }
          return mappedProcess;
        }),
        tap((res: ProcessModel) => this.requestedProcess = res)
      );
  }

  public getXML(url: string): Observable<any> {
    return this.http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
      responseType: 'text'
    });
  }

  public getRecentProcesses(): Observable<CatalogEntityModel[]> {
    const getRecentUrl = `${this.ApiUrl}/${ApiRoute.RECENT_PROCESSES}`;
    return this.http.get<CatalogEntityModel[]>(getRecentUrl)
      .pipe(
        map(
          (recentProcesses: CatalogEntityModel[]) => {
            return recentProcesses.map((process: CatalogEntityModel) => {
              if (!process.permissions) {
                process.permissions = CatalogEntityPermissionEnum.NO_ACCESS;
              }
              return process;
            });
          }
        )
      );
  }

  public saveProcess(
    process: ProcessModel,
    content: string): Observable<UiNotificationCheck> {
    // TODO
    if (this.requestedProcess?.id === process.id && this.requestedProcess?.activeResource) {
      this.requestedProcess.activeResource.content = content;
    }
    LocalSaverHelper.saveResource(process.parent.id, process.id, content);
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.put<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${process.parent.id}/${ApiRoute.PROCESSES}/${process.id}/${ApiRoute.RESOURCES}`, [{
      id: process.activeResource?.id || uuid(),
      type: process.activeResource?.type || ResourceTypeEnum.XML,
      content
    }], {headers}).pipe(
      switchMap(() => this.pendingNotificationChecked(correlationId))
    );
  }

  public createResource(folderId: string, processId: string, content: string, subRoot: string): Observable<void> {
    return this.http.post<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.RESOURCES}`, {
      type: ResourceTypeEnum.XML,
      content,
      subRoot
    });
  }

  public updateResource(folderId: string, processId: string, resourceId: string, content: string): Observable<void> {
    return this.http.put<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.RESOURCES}/${resourceId}`, {
      content
    });
  }

  public searchUsers(searchTerm: string): Observable<SearchModel<UserModel>> {
    return this.http.post<SearchModel<UserModel>>(`${this.ApiUrl}/${ApiRoute.SEARCH_USERS}`, {searchTerm});
  }

  public getProcessWorkGroup(folderId: string, processId: string): Observable<SearchModel<ProcessWorkgroupModel>> {
    return this.http.get<SearchModel<ProcessWorkgroupModel>>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.PERMISSIONS}`);
  }

  public deleteUserFromWorkgroup(folderId: string, processId: string, permissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.PERMISSIONS}/${permissionId}`);
  }

  public patchUserPermission(folderId: string, processId: string, permissionId: string, level: PermissionLevel): Observable<void> {
    return this.http.put<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.PERMISSIONS}/${permissionId}`, {level});
  }

  public changeProcessOwner(folderId: string, processId: string, currentOwnerId: string, newOwnerId: string): Observable<void> {
    return this.http.put<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.PERMISSIONS}/${ApiRoute.OWNER}`, {
      currentOwnerPermissionId: currentOwnerId,
      newOwnerPermissionId: newOwnerId
    });
  }

  public getUserInfo(username: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.ApiUrl}/${ApiRoute.USERS}/${username}`);
  }

  public grantAccessToProcess(folderId: string, processId: string, level: string, username: string): Observable<void> {
    return this.http.post<void>
    (`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.PERMISSIONS}`, {
      level,
      subRoot: folderId,
      username
    });
  }

  public getProcessOwner(folderId: string, processId: string): Observable<UserModel> {
    return this.http.get<UserModel>
    (`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.PERMISSIONS}/${ApiRoute.OWNER}`);
  }

  public getStartAndStopHistory(): Observable<SearchModel<ProcessVersionModel>> {
    return of({items: [], count: 0});
  }

  public getVersions(folderId: string, processId: string): Observable<SearchModel<ProcessVersionModel>> {
    return this.http.get<SearchModel<ProcessVersionModel>>
    (`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}`);
  }

  public createBasedOnPreviousVersion(folderId: string, processId: string, previousVersionID: string): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.post<void>
    (`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}/${ApiRoute.CREATE_BASED_ON_PREVIOUS_VERSION}/${previousVersionID}`, {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId))
      );
  }

  public createNewVersion(folderId: string, processId: string, version: CreateProcessVersionModel): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return this.http.post<void>
    (`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}`, version, {headers})
      .pipe(
        switchMap(() => this.pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked)
      );
  }

}
