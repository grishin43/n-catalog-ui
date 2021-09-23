import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Send request to delete process.
   * @param processId - id of folder with should be deleted
   */
  public deleteProcess(parentFolderId: string, processId: string): Promise<any> {
    return this.httpClient.delete(this.buildProcessDeleteUrl(processId, processId)).toPromise();
  }

  private buildProcessDeleteUrl(folderId: string, processId: string): string {
    return `${environment.apiV1}/folders/${folderId}/processes/${processId}}`;
  }
}
