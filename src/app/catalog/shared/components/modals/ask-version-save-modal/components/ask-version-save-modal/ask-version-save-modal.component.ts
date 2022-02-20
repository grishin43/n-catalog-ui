import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'np-ask-version-save-modal',
  templateUrl: './ask-version-save-modal.component.html',
  styleUrls: ['./ask-version-save-modal.component.scss']
})
export class AskVersionSaveModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AskVersionSaveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public versionName: string
  ) {
  }

  ngOnInit(): void {
  }

  public closeModal(flag?: boolean): void {
    this.dialogRef.close(flag);
  }

}
