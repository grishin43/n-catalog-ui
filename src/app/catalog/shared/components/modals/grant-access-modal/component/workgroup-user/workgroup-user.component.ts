import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {ProcessWorkgroupModel} from '../../../../../../../models/domain/process-workgroup.model';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from '../../../../../../services/api/api.service';
import {EntityPermissionLevelEnum} from '../../../../../../models/entity-permission-level.enum';
import {ToastService} from '../../../../../../../toast/service/toast.service';

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
  @Input() permissions: EntityPermissionLevelEnum[];

  @Output() requestSent = new EventEmitter<string>();

  public loader: boolean;
  public EntityPermissionLevel = EntityPermissionLevelEnum;

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
      this.api.deleteUserFromWorkgroup(this.folderId, this.processId, this.workgroup.id),
      'common.deletedFromWorkGroupSuccessfully'
    );
  }

  public changePermission(value: string): void {
    if (value === EntityPermissionLevelEnum.OWNER) {
      this.sendRequest(
        this.api.changeProcessOwner(this.folderId, this.processId, this.ownerPermissionId, this.workgroup.id),
        'common.processOwnerSuccessfullyChanged',
      );
    } else {
      this.sendRequest(
        this.api.patchUserPermission(this.folderId, this.processId, this.workgroup.id, value),
        'common.userPermissionSuccessfullyChanged',
        () => {
          this.workgroup.level.code = value;
        }
      );
    }
  }

  private sendRequest(request: Observable<any>, toastMessage: string, successCb?: () => void): void {
    this.loader = true;
    this.subs.add(
      request.subscribe(() => {
        this.loader = false;
        if (typeof successCb === 'function') {
          successCb();
        }
        this.toast.showMessage(toastMessage);
        this.requestSent.emit();
      }, () => {
        this.loader = false;
      })
    );
  }

}
