import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Send request to delete folder.
   * @param folderId - id of folder with should be deleted
   */
  public deleteFolder(folderId: string): Promise<any> {
    return this.httpClient.delete(this.buildFolderDeleteUrl(folderId)).toPromise();
  }

  private buildFolderDeleteUrl(folderId: string): string {
    return `${environment.apiV1}/folders/${folderId}`;
  }
}
