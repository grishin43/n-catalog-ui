import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {ApiService} from '../../../../services/api/api.service';
import {catchError, tap} from 'rxjs/operators';
import {FolderFieldKey, FolderModel} from '../../../../../models/domain/folder.model';
import {FolderActions} from '../../../../store/folder/folder.actions';
import {ProcessActions} from '../../../../store/process/process.actions';
import {Observable} from 'rxjs';
import {UiNotificationCheck} from '../../../../../models/domain/ui-notification.check';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private apiService: ApiService
  ) {
  }

  /**
   * Send request to delete folder.
   * @param folderId - id of folder with should be deleted
   */
  public deleteFolder(folderId: string): Promise<any> {
    // optimistic update
    this.store.dispatch(new FolderActions.FolderMarkedToBeDeleted(folderId));
    return this.apiService.deleteFolder(folderId)
      .pipe(
        catchError((err) => {
          console.log('delete folder error, revert delete', err);
          return this.store.dispatch(new FolderActions.FolderRevertToBeDeleted(folderId));
        }),
        tap(() => {
          this.store.dispatch(new FolderActions.FolderDeleted(folderId));
        })
      )
      .toPromise();
  }

  public async fetchFolderDetails(folderId: string): Promise<any> {
    // ToDo move this method from API Service to Folder Service
    await this.apiService.getFolderByIdWithSubs(folderId)
      .pipe(
        tap((folder: FolderModel) => {
          this.store.dispatch(new FolderActions.FoldersFetched([folder]));
          if (folder?.[FolderFieldKey.FOLDERS]?.count) {
            const folders = folder[FolderFieldKey.FOLDERS]?.items;
            this.store.dispatch(new FolderActions.SubFolderFetched(folders, folderId));
          }
          if (folder?.[FolderFieldKey.PROCESSES]?.count) {
            const processes = folder[FolderFieldKey.PROCESSES]?.items;
            this.store.dispatch(new ProcessActions.FolderProcessesFetched(processes, folderId));
          }
        })
      ).toPromise();
  }

  public createFolder(parentFolderId: string, name: string): Observable<UiNotificationCheck> {
    return this.apiService.createFolder(parentFolderId, name);
  }

  public renameFolder(folderId: string, newName: string, oldName: string): Observable<UiNotificationCheck> {
    // optimistic update
    this.store.dispatch(new FolderActions.FolderRenamed(folderId, newName));

    return this.apiService.renameFolder(folderId, newName)
      .pipe(catchError((err) => {
        console.log('rename folder error, revert back to previous value', err);
        return this.store.dispatch(new FolderActions.FolderRenamed(folderId, oldName));
      }));
  }

}
