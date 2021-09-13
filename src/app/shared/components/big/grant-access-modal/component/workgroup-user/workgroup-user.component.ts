import {Component, Input, OnDestroy} from '@angular/core';
import {ProcessWorkgroupModel} from '../../../../../../models/domain/process-workgroup.model';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from '../../../../../../catalog/services/api/api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../small/toast/service/toast.service';
import {PermissionLevel} from '../../../../../../models/domain/permission-level.enum';

@Component({
  selector: 'np-workgroup-user',
  templateUrl: './workgroup-user.component.html',
  styleUrls: ['./workgroup-user.component.scss']
})
export class WorkgroupUserComponent implements OnDestroy {
  @Input() folderId: string;
  @Input() processId: string;
  @Input() ownerPermissionId?: string;
  @Input() workgroup: ProcessWorkgroupModel;

  public workgroupLevelCode = PermissionLevel;
  public workgroupLevelCodes = Object.values(PermissionLevel);
  public loader: boolean;

  private subs = new Subscription();

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public deleteUser(): void {
    this.sendRequest(
      this.api.deleteUserFromWorkgroup(this.folderId, this.processId, this.workgroup.id)
    );
  }

  public changePermission(value: PermissionLevel): void {
    if (value === PermissionLevel.OWNER) {
      this.sendRequest(
        this.api.changeProcessOwner(this.folderId, this.processId, this.ownerPermissionId, this.workgroup.id)
      );
    } else {
      this.sendRequest(
        this.api.patchUserPermission(this.folderId, this.processId, this.workgroup.id, value),
        () => {
          this.workgroup.level.code = value;
        }
      );
    }
  }

  private sendRequest(request: Observable<any>, successCb?: () => void): void {
    this.loader = true;
    this.subs.add(
      request.subscribe(() => {
        this.loader = false;
        if (typeof successCb === 'function') {
          successCb();
        }
      }, (err: HttpErrorResponse) => {
        this.loader = false;
        this.toast.showError('errors.errorOccurred', err.error?.message || err.message);
      })
    );
  }

}
