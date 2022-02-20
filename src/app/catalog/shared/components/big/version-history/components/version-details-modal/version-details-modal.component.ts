import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProcessVersionModel} from '../../../../../../../models/domain/process-version.model';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'np-version-details-modal',
  templateUrl: './version-details-modal.component.html',
  styleUrls: ['./version-details-modal.component.scss']
})
export class VersionDetailsModalComponent implements OnInit {
  public readonly dateFormat: string = 'dd.MM.yyyy o HH:mm';

  constructor(
    private dialogRef: MatDialogRef<VersionDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcessVersionModel,
    private kc: KeycloakService
  ) {
  }

  ngOnInit(): void {
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public get isOwner(): boolean {
    return this.data.author === this.kc.getUsername();
  }

}
