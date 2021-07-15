import {Component} from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {WysiwygHelper} from '../../../helpers/wysiwyg.helper';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'np-wysiwyg-editor',
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss']
})
export class WysiwygEditorComponent {
  public htmlContent: string;
  public editorConfig: AngularEditorConfig = WysiwygHelper.config;

  constructor(private bottomSheetRef: MatBottomSheetRef<WysiwygEditorComponent>) {
  }

  public closeEditor(event: MouseEvent): void {
    event.preventDefault();
    this.bottomSheetRef.dismiss();
  }

}
