import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../catalog/services/api/api.service';
import {UserModel} from '../../../../../models/domain/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'np-access-denied-modal',
  templateUrl: './process-access-denied-modal.component.html',
  styleUrls: ['./process-access-denied-modal.component.scss']
})
export class ProcessAccessDeniedModalComponent implements OnInit, OnDestroy {
  public processOwner: UserModel;
  public loader: boolean;

  private subs = new Subscription();

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.closeModal();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<ProcessAccessDeniedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      folderId: string;
      processId: string;
    },
    private api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.getOwner();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getOwner(): void {
    if (this.data.folderId && this.data.processId) {
      this.loader = true;
      this.subs.add(
        this.api.getProcessOwner(this.data.folderId, this.data.processId)
          .subscribe((res: UserModel) => {
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
