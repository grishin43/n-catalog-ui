import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'np-cant-delete-folder-modal',
  templateUrl: './cant-delete-folder-modal.component.html',
  styleUrls: ['./cant-delete-folder-modal.component.scss']
})
export class CantDeleteFolderModalComponent implements OnInit {

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.closeModal();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<CantDeleteFolderModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
