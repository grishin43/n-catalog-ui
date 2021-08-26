import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ContentHelper} from '../../helpers/content.helper';
import {defaultIfEmpty, delay, exhaustMap, map, tap} from 'rxjs/operators';
import {SearchModel} from '../../../models/domain/search.model';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {ProcessModel} from '../../../models/domain/process.model';
import {ProcessTypeModel} from '../../../models/domain/process-type.model';
import {Base64} from 'js-base64';
import {MapHelper} from '../../helpers/map.helper';
import {CatalogEntityPermissionEnum} from '../../models/catalog-entity-permission.enum';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {ResourceModel} from '../../../models/domain/resource.model';
import {EntitiesTabService} from '../entities-tab/entities-tab.service';

enum ApiRoute {
  FOLDERS = 'folders',
  RENAME = 'rename',
  MOVE = 'move',
  PROCESSES = 'processes',
  ORIGINS = 'origins',
  RECENT_PROCESSES = 'processes/recent',
  RESOURCES = 'resources'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly ApiUrl = 'https://businesscatalogapi.bc.dev.digital.np.work/api/v1';

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

  public createFolder(parentFolderId: string, name: string): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.FOLDERS}`, {
      name
    });
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
  public deleteFolder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${id}`);
  }

  public createProcess(parentFolderId: string, processType: string, name: string): Observable<ProcessModel> {
    return this.http.post<ProcessModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}`, {
      origin: processType,
      name
    });
  }

  public deleteProcess(folderId: string, processId: string): Observable<any> {
    return this.http.delete<void>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`);
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<null> {
    return this.http.put<null>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.PROCESSES}/${processId}/${ApiRoute.RENAME}`,
      {name})
      .pipe(
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

  public getMockedRootFolders(): Observable<CatalogEntityModel[]> {
    // TODO
    // return this.http.get<CatalogEntityModel[]>(`${this.ApiUrl}`);
    return of(ContentHelper.catalogMainFolders);
  }

  public getMockedFolderById(id: string): Observable<CatalogEntityModel> {
    // TODO
    // return this.http.get<CatalogEntityModel>(`${this.ApiUrl}`);
    return this.getMockedRootFolders().pipe(
      map((folders: CatalogEntityModel[]) => {
        return folders.find((folder: CatalogEntityModel) => folder.id === id);
      })
    );
  }

  public getProcessById(folderId: string, processId: string): Observable<ProcessModel> {
    return this.http.get<ProcessModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${folderId}/${ApiRoute.PROCESSES}/${processId}`)
      .pipe(
        map((res: ProcessModel) => {
          return {
            ...res,
            subRoot: res.path.length > 1
              ? res.path[res.path.length - 1].id
              : res.path[0].id,
            activeResource: res.resources.find((r: ResourceModel) => r.type === ResourceTypeEnum.XML)
          };
        })
      );
  }

  public searchEntities(str: string): Observable<CatalogEntityModel[]> {
    // TODO
    // return this.http.get<CatalogEntityModel>(`${this.ApiUrl}`);
    return this.getMockedRootFolders().pipe(
      map((folders: CatalogEntityModel[]) => {
        return folders.find((folder: CatalogEntityModel) => {
          return !!folder.entities?.length;
        })?.entities.filter((process: CatalogEntityModel) => {
          return process.name.indexOf(str) !== -1;
        });
      })
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
                process.permissions = CatalogEntityPermissionEnum.NO_PERMISSIONS;
              }
              return process;
            });
          }
        )
      );
  }

  public saveResource(
    process: ProcessModel,
    content: string): Observable<void> {
    if (process.activeResource?.id) {
      return this.updateResource(process.parent.id, process.id, process.activeResource.id, content);
    } else {
      return this.createResource(process.parent.id, process.id, content, process.subRoot);
    }
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

}
