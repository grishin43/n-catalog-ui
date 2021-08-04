import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ContentHelper} from '../../helpers/content.helper';
import {defaultIfEmpty, exhaustMap, map, switchMap, tap} from 'rxjs/operators';
import {SearchModel} from '../../../models/domain/search.model';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {ProcessModel} from '../../../models/domain/process.model';
import {ProcessTypeModel} from '../../../models/domain/process-type.model';

enum ApiRoute {
  FOLDERS = 'folders',
  RENAME = 'rename',
  MOVE = 'move',
  DEFINITIONS = 'definitions',
  ORIGINS = 'origins'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly ApiUrl = 'https://businesscatalogapi.bc.dev.digital.np.work/api/v1';

  constructor(
    private http: HttpClient
  ) {
  }

  public createRootFolder(name: string): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}`, {name});
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
      id: parentFolderId,
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
            root: !folder.parent
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
    return this.http.post<ProcessModel>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.DEFINITIONS}`, {
      id: parentFolderId,
      origin: processType,
      name
    });
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<{ name: string }> {
    return this.http.put<{ name: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.DEFINITIONS}/${processId}/${ApiRoute.RENAME}`, {
      folderId: parentFolderId,
      definitionId: processId,
      name
    });
  }

  public moveProcess(parentFolderId: string, processId: string, targetFolderId: string): Observable<{ folder: string }> {
    return this.http.post<{ folder: string }>(`${this.ApiUrl}/${ApiRoute.FOLDERS}/${parentFolderId}/${ApiRoute.DEFINITIONS}/${processId}/${ApiRoute.MOVE}`, {
      folderId: parentFolderId,
      definitionId: processId,
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

  public getFileById(id: string): Observable<CatalogEntityModel> {
    // TODO
    // return this.http.get<CatalogEntityModel>(`${this.ApiUrl}`);
    return this.getMockedRootFolders().pipe(
      map((folders: CatalogEntityModel[]) => {
        return folders.find((folder: CatalogEntityModel) => {
          return !!folder.entities?.length;
        })?.entities.find((file: CatalogEntityModel) => {
          return file.id === id;
        });
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
        })?.entities.filter((file: CatalogEntityModel) => {
          return file.name.indexOf(str) !== -1;
        });
      })
    );
  }

  public getXML(fileLink: string): Observable<any> {
    return this.http.get(fileLink, {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
      responseType: 'text'
    });
  }

}
