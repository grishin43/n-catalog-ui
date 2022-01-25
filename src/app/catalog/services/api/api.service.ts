import {Injectable} from '@angular/core';
import {forkJoin, merge, Observable, of, throwError, timer} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {delay, retryWhen, defaultIfEmpty, exhaustMap, filter, map, mapTo, switchMap, take, tap} from 'rxjs/operators';
import {SearchModel} from '../../../models/domain/search.model';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {ProcessTypeModel} from '../../../models/domain/process-type.model';
import {UserModel} from '../../../models/domain/user.model';
import {ProcessWorkgroupModel} from '../../../models/domain/process-workgroup.model';
import {PermissionLevel} from '../../../models/domain/permission-level.enum';
import {CreateProcessVersionModel, ProcessVersionModel} from '../../../models/domain/process-version.model';
import {v4 as uuid} from 'uuid';
import {UiNotificationCheck} from '../../../models/domain/ui-notification.check';
import {CollectionWrapperDto} from '../../../models/domain/collection-wrapper.dto';
import {UiNotification} from '../../../models/domain/ui-notification';
import {environment} from '../../../../environments/environment';
import {MapHelper} from '../../helpers/map.helper';
import {KeycloakService} from 'keycloak-angular';
import {TranslateService} from '@ngx-translate/core';
import {CatalogActions} from '../../store/actions/catalog.actions';
import {Store} from '@ngxs/store';
import {ProcessModel} from '../../../models/domain/process.model';

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
  VERSIONS = 'versions',
  UI_NOTIFICATIONS = 'uiNotifications',
  DISCARD_CHANGES = 'discardChanges'
}

enum ApiHeader {
  CORRELATION_ID = 'x-correlation-id'
}

enum UiNotificationType {
  PROCESS_PERMISSION_ASSIGNED = 'process_permission_assigned'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly ApiUrl = 'https://businesscatalogapi.bc.dev.digital.np.work/api/v1';
  private latestProcessedNotification: UiNotification;

  constructor(
    private http: HttpClient,
    private kc: KeycloakService,
    private translate: TranslateService,
    private store: Store
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
    return this.http.get<ProcessModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`)
      .pipe(
        map((res: ProcessModel) => MapHelper.mapProcessResponse(res, folderId, processId, this.kc.getUsername()))
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
    return this.http.get<CatalogEntityModel[]>(`${this.ApiUrl}/${ApiRoute.RECENT_PROCESSES}`)
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
    // TODO: test content
    return of({
      username: 'test.test',
      email: 'test.user@novaposta.ua',
      firstName: 'Іван',
      middleName: 'Іванович',
      lastName: 'Іванченко',
      companies: [
        {
          name: 'Нова Пошта Україна 1',
          subDivision: 'Тест підрозділ',
          position: 'Фахівець 1',
        },
        {
          name: 'Нова Пошта Україна 2',
          subDivision: 'Тест підрозділ',
          position: 'Фахівець 2',
        },
        {
          name: 'Нова Пошта Україна 3',
          subDivision: 'Тест підрозділ',
          position: 'Фахівець 3',
        }
      ],
      url: 'https://www.google.com.ua'
    } as UserModel);
    /*return this.http.get<UserModel>(`${this.ApiUrl}/${ApiRoute.USERS}/${username}`);*/
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

  public getVersionById(folderId: string, processId: string, versionId: string): Observable<ProcessModel> {
    return this.http.get<ProcessModel>
    (`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}/${versionId}`);
  }

  /******************
   * Async requests *
   ******************/

  public createFolder(parentFolderId: string, name: string): Observable<UiNotificationCheck> {
    return this.checkRequestNotification((headers: HttpHeaders) => {
      return this.http.post<{ name: string }>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.FOLDERS}`,
        {name},
        {headers});
    });
  }

  public renameFolder(id: string, name: string): Observable<UiNotificationCheck> {
    return this.checkRequestNotification((headers: HttpHeaders) => {
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
    return this.checkRequestNotification((headers: HttpHeaders) => {
      return this.http.delete<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}`,
        {headers}
      );
    });
  }

  public createProcess(parentFolderId: string, processType: string, name: string): Observable<UiNotificationCheck> {
    return this.checkRequestNotification((headers: HttpHeaders) => {
      return this.http.post<ProcessModel>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}`,
        {origin: processType, name},
        {headers}
      );
    }, UiNotificationType.PROCESS_PERMISSION_ASSIGNED);
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<UiNotificationCheck> {
    return this.checkRequestNotification((headers: HttpHeaders) => {
      return this.http.put<null>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.RENAME}`,
        {name},
        {headers}
      );
    }, undefined, processId);
  }

  public deleteProcess(folderId: string, processId: string): Observable<UiNotificationCheck> {
    return this.checkRequestNotification((headers: HttpHeaders) => {
      return this.http.delete<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`,
        {headers}
      );
    });
  }

  public saveProcess(process: ProcessModel): Observable<UiNotificationCheck> {
    return this.checkRequestNotification((headers: HttpHeaders) => {
      return this.http.put<void>(
        `${this.ApiUrl}/${ApiRoute.FOLDERS}/${process.parent.id}/${ApiRoute.PROCESSES}/${process.id}/${ApiRoute.RESOURCES}`,
        {resources: process.resources, generation: process.generation},
        {headers}
      );
    }, undefined, process.id);
  }

  public createNewVersion(folderId: string, processId: string, version: CreateProcessVersionModel): Observable<UiNotificationCheck> {
    return this.checkRequestNotification(
      (headers: HttpHeaders) => {
        return this.http.post<void>(
          `${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}`,
          version,
          {headers}
        );
      }, undefined, processId);
  }

  public discardChanges(folderId: string, processId: string, generation: number): Observable<UiNotificationCheck> {
    return this.checkRequestNotification(
      (headers: HttpHeaders) => {
        return this.http.post<void>(
          `${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.VERSIONS}/${ApiRoute.DISCARD_CHANGES}`,
          {generation},
          {headers}
        );
      }, undefined, processId);
  }

  private checkRequestNotification(request: (headers: HttpHeaders) => Observable<any>, notificationType?: string, processId?: string)
    : Observable<UiNotificationCheck> {
    const correlationId = uuid();
    const headers = new HttpHeaders().set(
      ApiHeader.CORRELATION_ID, correlationId
    );
    if (processId) {
      return request(headers)
        .pipe(
          switchMap(() => this.pendingNotificationChecked(correlationId, notificationType)),
          filter((nc: UiNotificationCheck) => nc.isChecked),
          switchMap(() => this.getNotifications()),
          map((un: CollectionWrapperDto<UiNotification>) => {
            return un.items.filter((n: UiNotification) => n.parameters.processID === processId);
          }),
          map((un: UiNotification[]) => {
            try {
              return un.reduce((prev: UiNotification, next: UiNotification) => {
                return (prev.notificationNumber > next.notificationNumber) ? prev : next;
              });
            } catch (e) {
              console.warn('Got an empty notification list');
            }
          }),
          switchMap((n: UiNotification) => {
            return this.sendNotificationProcessed(n);
          }),
          tap((n: UiNotification) => {
            const freshGeneration = n?.parameters?.generation || n?.parameters?.parentProcessGeneration;
            if (freshGeneration) {
              this.store.dispatch(new CatalogActions.ProcessGenerationPatched(freshGeneration));
            }
          }),
          map(({parameters}: UiNotification) => {
            return {correlationId, isChecked: true, parameters} as UiNotificationCheck;
          })
        );
    } else {
      return request(headers)
        .pipe(
          switchMap(() => this.pendingNotificationChecked(correlationId, notificationType)),
          filter((notification: UiNotificationCheck) => notification.isChecked)
        );
    }
  }

  private pendingNotificationChecked(correlationId: string, notificationType?: string)
    : Observable<UiNotificationCheck> {
    const createDraftProcess$ = of({correlationId, isChecked: false} as UiNotificationCheck);
    const checkUiNotification$ = this.checkNotificationRetry(correlationId, notificationType);
    return merge(createDraftProcess$, checkUiNotification$);
  }

  private checkNotificationRetry(correlationId: string, notificationType?: string): Observable<any> {
    const maxRetry = environment.checkNotificationMaxRetryNumber;
    const currentRetry = 0;
    return this.http.get<CollectionWrapperDto<UiNotification>>(`${this.ApiUrl}/${ApiRoute.UI_NOTIFICATIONS}`)
      .pipe(
        switchMap(({items}: CollectionWrapperDto<UiNotification>) => {
          if (this.containNotificationWithCorrelationId(items, correlationId, notificationType)) {
            return of(items);
          } else {
            return throwError(new Error('correlation id isn`t found, make one more request'));
          }
        }),
        retryWhen((error: any) => {
          return this.retryDelayWithCount(error, maxRetry, currentRetry);
        }),
        switchMap((notifications: UiNotification[]) => {
          const requiredNotification = notifications.find((notification: UiNotification) => {
            return notificationType != null
              ? notification.correlationID === correlationId && notification.notificationType === notificationType
              : notification.correlationID === correlationId;
          });
          return this.sendNotificationProcessed(requiredNotification);
        }),
        take(1),
        map(({parameters}: UiNotification) => {
          return {correlationId, isChecked: true, parameters} as UiNotificationCheck;
        })
      );
  }

  private retryDelayWithCount(error: any, maxRetry: number, currentRetry: number): any {
    return error.pipe(
      delay(2000),
      switchMap(() => {
        if (maxRetry > currentRetry++) {
          return of(true);
        } else {
          console.warn(`Max retry number ${maxRetry} for getting notification reached.`);
          return throwError(new Error(this.translate.instant('errors.timedOutRequest')));
        }
      })
    );
  }

  private containNotificationWithCorrelationId(notifications: UiNotification[], correlationId: string, notificationType?: string): boolean {
    return notifications.some((notification: UiNotification) => {
      return notificationType != null
        ? notification.correlationID === correlationId && notification.notificationType === notificationType
        : notification.correlationID === correlationId;
    });
  }

  private sendNotificationProcessed(notification: UiNotification): Observable<UiNotification> {
    if (notification) {
      const lastAckNotificationNumber = notification.notificationNumber;
      return this.http.post(`${this.ApiUrl}/${ApiRoute.UI_NOTIFICATIONS}?lastAckNotificationNumber=${lastAckNotificationNumber}`, {})
        .pipe(
          tap(() => this.latestProcessedNotification = notification),
          mapTo(notification)
        );
    }
    return of(this.latestProcessedNotification);
  }

  private getNotifications(): Observable<CollectionWrapperDto<UiNotification>> {
    return this.http.get<CollectionWrapperDto<UiNotification>>(`${this.ApiUrl}/${ApiRoute.UI_NOTIFICATIONS}`);
  }

}
