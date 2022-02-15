import {Component, OnDestroy} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'np-tabs-overflowed-modal',
  templateUrl: './tabs-overflowed-modal.component.html',
  styleUrls: ['./tabs-overflowed-modal.component.scss']
})
export class TabsOverflowedModalComponent implements OnDestroy {
  public onCloseFlag: boolean;

  constructor(
    private dialogRef: MatDialogRef<TabsOverflowedModalComponent>
  ) {
  }

  ngOnDestroy(): void {
    this.dialogRef.close(this.onCloseFlag);
  }

  public closeModal(flag?: boolean): void {
    this.onCloseFlag = flag;
    this.dialogRef.close();
  }


}
