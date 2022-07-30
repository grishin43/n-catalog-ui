import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../../../services/api/api.service';
import {WorkgroupUserModel} from '../../../../../../models/domain/user.model';

@Component({
  selector: 'np-request-access-modal',
  templateUrl: './request-access-modal.component.html',
  styleUrls: ['./request-access-modal.component.scss']
})
export class RequestAccessModalComponent implements OnInit, OnDestroy {
  public processOwner: WorkgroupUserModel;
  public loader: boolean;

  private subs = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<RequestAccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.getOwner();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getOwner(): void {
    if (this.data) {
      this.loader = true;
      this.subs.add(
        this.apiService.getUserInfo(this.data)
          .subscribe((res: WorkgroupUserModel) => {
            this.loader = false;
            this.processOwner = res;
          }, () => {
            this.loader = false;
          })
      );
    }
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

}
