import {Injectable} from '@angular/core';
import {Observable, of, pipe} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ContentHelper} from '../../helpers/content.helper';
import {delay, map, tap} from 'rxjs/operators';

enum ApiRoute {
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly ApiUrl = '';

  constructor(
    private http: HttpClient
  ) {
  }

  public getRootFolders(): Observable<CatalogEntityModel[]> {
    // TODO
    // return this.http.get<CatalogEntityModel[]>(`${this.ApiUrl}`);
    return of(ContentHelper.catalogMainFolders);
  }

  public getFolderById(id: string): Observable<CatalogEntityModel> {
    // TODO
    // return this.http.get<CatalogEntityModel>(`${this.ApiUrl}`);
    return this.getRootFolders().pipe(
      map((folders: CatalogEntityModel[]) => {
        return folders.find((folder: CatalogEntityModel) => folder.id === id);
      })
    );
  }

  public getFileById(id: string): Observable<CatalogEntityModel> {
    // TODO
    // return this.http.get<CatalogEntityModel>(`${this.ApiUrl}`);
    return this.getRootFolders().pipe(
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
    return this.getRootFolders().pipe(
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
