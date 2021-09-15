import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ProcessAutosaveService} from '../../../../../catalog/services/process-autosave/process-autosave.service';

@Component({
  selector: 'np-prevent-process-close-modal',
  templateUrl: './prevent-process-close-modal.component.html',
  styleUrls: ['./prevent-process-close-modal.component.scss']
})
export class PreventProcessCloseModalComponent {

  constructor(
    private dialogRef: MatDialogRef<PreventProcessCloseModalComponent>,
    public processAutosave: ProcessAutosaveService
  ) {
  }

  public dontSave(): void {
    this.processAutosave.disableSaving();
    this.closeModal(true);
  }

  public save(): void {
    this.processAutosave.saveProcess(this.processAutosave.process)
      .then(() => this.dialogRef.close(true));
  }

  public closeModal(res: boolean): void {
    this.dialogRef.close(res);
  }

  public get processName(): string {
    return this.processAutosave.process?.name;
  }

}
