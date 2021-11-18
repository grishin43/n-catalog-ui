import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../environments/environment';
import {Store} from '@ngxs/store';
import {ApiService} from '../../../../services/api/api.service';
import {tap} from 'rxjs/operators';
import {FolderFieldKey, FolderModel} from '../../../../../models/domain/folder.model';
import {FolderActions} from '../../../../store/folder/folder.actions';
import {ProcessActions} from '../../../../store/process/process.actions';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private apiService: ApiService
  ) {}

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

  public async fetchFolderDetails(folderId: string) {
    // ToDo move this method from API Service to Folder Service
     await this.apiService.getFolderByIdWithSubs(folderId)
       .pipe(
         tap((folder: FolderModel) => {
           this.store.dispatch(new FolderActions.FoldersFetched([folder]));
           if (folder?.[FolderFieldKey.FOLDERS]?.count) {
             const folders = folder[FolderFieldKey.FOLDERS]?.items;
             this.store.dispatch(new FolderActions.FoldersFetched(folders));
           }
           if (folder?.[FolderFieldKey.PROCESSES]?.count) {
             const processes = folder[FolderFieldKey.PROCESSES]?.items;
             this.store.dispatch(new ProcessActions.ProcessesFetched(processes));
           }
         })
       ).toPromise();
  }
}
