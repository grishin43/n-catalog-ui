import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'np-save-version-modal',
  templateUrl: './save-version-modal.component.html',
  styleUrls: ['./save-version-modal.component.scss']
})
export class SaveVersionModalComponent implements OnInit {

  saveVersionFrom: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SaveVersionModalComponent>,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.saveVersionFrom = new FormGroup({
      'versionName': new FormControl('', [Validators.required]),
      'description': new FormControl('')
    });
  }

  saveVersion() {
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
