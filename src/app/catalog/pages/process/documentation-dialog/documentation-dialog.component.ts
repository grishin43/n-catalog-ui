import {Component, Inject, OnDestroy} from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {WysiwygHelper} from '../../../helpers/wysiwyg.helper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'np-documentation-dialog',
  templateUrl: './documentation-dialog.component.html',
  styleUrls: ['./documentation-dialog.component.scss']
})
export class DocumentationDialogComponent implements OnDestroy {
  public editorConfig: AngularEditorConfig = WysiwygHelper.config;

  constructor(
    private dialogRef: MatDialogRef<DocumentationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public htmlContent: string
  ) {
  }

  ngOnDestroy(): void {
    this.closeModal();
  }

  public closeModal(): void {
    this.dialogRef.close(this.htmlContent);
  }

}
