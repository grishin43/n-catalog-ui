import {Injectable} from '@angular/core';
import {forkJoin, merge, Observable, of, throwError, timer} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {defaultIfEmpty, exhaustMap, filter, map, mapTo, switchMap, take, tap} from 'rxjs/operators';
import {SearchModel} from '../../../models/domain/search.model';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {ProcessModel} from '../../../models/domain/process.model';
import {ProcessTypeModel} from '../../../models/domain/process-type.model';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {ResourceModel} from '../../../models/domain/resource.model';
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
import {MapHelper} from '../../helpers/map.helper';

enum ApiRoute {
  FOLDERS = 'folders',
  RENAME = 'rename',
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
  UI_NOTIFICATIONS = 'uiNotifications'
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

  constructor(
    private http: HttpClient
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
        map((res: FolderModel[]): SearchModel<FolderModel> => MapHelper.mapRootFoldersWithSubsResponse(res))
      );
  }

  public getFolderByIdWithSubs(id: string): Observable<FolderModel> {
    // TODO
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
        map((res: FolderModel[] | FolderModel): FolderModel => MapHelper.mapFolderByIdWithSubsResponse(res, folder))
      );
  }

  public getFolderById(id: string): Observable<FolderModel> {
    return this.http.get<FolderModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}`)
      .pipe(
        map((folder: FolderModel) => MapHelper.mapFolderResponse(folder, id))
      );
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
        map((res: ProcessModel) => MapHelper.mapProcessResponse(res, folderId, processId)),
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
        map((recentProcesses: CatalogEntityModel[]) => MapHelper.mapRecentProcessesResponse(recentProcesses))
      );
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

  /******************
   * Async requests *
   ******************/

  public createFolder(parentFolderId: string, name: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.post<{ name: string }>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.FOLDERS}`,
        {name},
        {headers});
    });
  }

  public renameFolder(id: string, name: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.put<{ name: string }>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}/${ApiRoute.RENAME}`,
        {name},
        {headers});
    });
  }

  /**
   * Only an empty folder is allowed to be deleted.
   * When you try to delete a folder that contains other folders or processes, the response status will be 403.
   */
  public deleteFolder(id: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.delete<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}`,
        {headers}
      );
    });
  }

  public createProcess(parentFolderId: string, processType: string, name: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.post<ProcessModel>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}`,
        {origin: processType, name},
        {headers}
      );
    });
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.put<null>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.RENAME}`,
        {name},
        {headers}
      );
    });
  }

  public deleteProcess(folderId: string, processId: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.delete<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`,
        {headers}
      );
    });
  }

  public saveProcess(
    process: ProcessModel,
    content: string): Observable<UiNotificationCheck> {
    // TODO
    if (this.requestedProcess?.id === process.id && this.requestedProcess?.activeResource) {
      this.requestedProcess.activeResource.content = content;
    }
    LocalSaverHelper.saveResource(process.parent.id, process.id, content);
    const resources: ResourceModel[] = [{
      id: process.activeResource?.id || uuid(),
      type: process.activeResource?.type || ResourceTypeEnum.XML,
      content
    }];
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.put<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${process.parent.id}/${ApiRoute.PROCESSES}/${process.id}/${ApiRoute.RESOURCES}`,
        resources,
        {headers}
      );
    });
  }

  public createBasedOnPreviousVersion(folderId: string, processId: string, previousVersionID: string): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.post<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}/${ApiRoute.CREATE_BASED_ON_PREVIOUS_VERSION}/${previousVersionID}`,
        {},
        {headers}
      );
    });
  }

  public createNewVersion(folderId: string, processId: string, version: CreateProcessVersionModel): Observable<UiNotificationCheck> {
    return this._checkRequestNotification((headers: HttpHeaders) => {
      return this.http.post<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}`,
        version,
        {headers}
      );
    });
  }

  private _checkRequestNotification(request: (headers: HttpHeaders) => Observable<any>): Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    return request(headers)
      .pipe(
        switchMap(() => this._pendingNotificationChecked(correlationId)),
        filter((notification: UiNotificationCheck) => notification.isChecked)
      );
  }

  private _pendingNotificationChecked(correlationId: string): Observable<UiNotificationCheck> {
    const createDraftProcess$ = of({correlationId, isChecked: false} as UiNotificationCheck);
    const checkUiNotification$ = this._checkNotification(correlationId);
    return merge(createDraftProcess$, checkUiNotification$);
  }

  private _checkNotification(correlationId: string): Observable<any> {
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
          const requiredNotification = notifications.find((notification: UiNotification) => notification.correlationID === correlationId);
          return this._sendNotificationProcessed(requiredNotification);
        }),
        take(1),
        map(({parameters}: UiNotification) => {
          return {correlationId, isChecked: true, parameters} as UiNotificationCheck;
        })
      );
  }

  private _sendNotificationProcessed(notification: UiNotification): Observable<UiNotification> {
    const lastAckNotificationNumber = notification.notificationNumber;
    return this.http.post(`${this.ApiUrl}/${ApiRoute.UI_NOTIFICATIONS}?lastAckNotificationNumber=${lastAckNotificationNumber}`, {})
      .pipe(mapTo(notification));
  }

}
