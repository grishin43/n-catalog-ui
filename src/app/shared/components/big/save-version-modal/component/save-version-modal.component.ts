import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'np-save-version-modal',
  templateUrl: './save-version-modal.component.html',
  styleUrls: ['./save-version-modal.component.scss']
})
export class SaveVersionModalComponent implements OnInit {

  public saveVersionFrom: FormGroup;

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.saveVersion();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<SaveVersionModalComponent>,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.saveVersionFrom = new FormGroup({
      versionName: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  saveVersion(): void {
    if (this.saveVersionFrom.valid) {
      const formDetails = this.saveVersionFrom.value;
      this.dialogRef.close(formDetails);
    } else {
      console.log('form invalid');
    }
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
