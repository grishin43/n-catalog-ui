import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {ApiService} from '../../../../services/api/api.service';
import {Store} from '@ngxs/store';
import {ProcessActions} from '../../../../store/process/process.actions';
import {UiNotificationCheck} from '../../../../../models/domain/ui-notification.check';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiService,
    private store: Store
  ) {
  }

  /**
   * Send request to delete process.
   * @param parentFolderId - ...
   * @param processId - id of folder with should be deleted
   */
  public deleteProcess(parentFolderId: string, processId: string): Observable<any> {
    return this.apiService.deleteProcess(parentFolderId, processId)
      .pipe(tap(() => {
        this.store.dispatch(new ProcessActions.ProcessDeleted(processId));
      }));
  }

  public createProcess(parentFolderId: string, processType: string, name: string): Observable<UiNotificationCheck> {
    return this.apiService.createProcess(parentFolderId, processType, name)
      .pipe(filter((notification: UiNotificationCheck) => {
        // create optimistic process creation
        return notification.isChecked;
      }));
  }

  public renameProcess(parentFolderId: string, processId: string, name: string): Observable<null> {
    return this.apiService.renameProcess(parentFolderId, processId, name)
      .pipe(tap(() => this.store.dispatch(new ProcessActions.ProcessRenamed(processId, name))));
  }
}

