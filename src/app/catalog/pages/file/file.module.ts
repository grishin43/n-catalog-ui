import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileComponent} from './file.component';
import {RouterModule, Routes} from '@angular/router';
import {FileTopToolbarComponent} from './file-top-toolbar/file-top-toolbar.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {NpButtonModule} from '../../../shared/components/small/np-button/np-button.module';
import {BpmnEditorComponent} from './bpmn-editor/bpmn-editor.component';
import {CreateFileModalModule} from '../../../shared/components/big/create-file-modal/create-file-modal.module';
import {ToolbarActionBtnComponent} from './file-top-toolbar/toolbar-action-btn/toolbar-action-btn.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {WysiwygEditorComponent} from './wysiwyg-editor/wysiwyg-editor.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: FileComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    FileComponent,
    FileTopToolbarComponent,
    BpmnEditorComponent,
    ToolbarActionBtnComponent,
    WysiwygEditorComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        MatMenuModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        NpButtonModule,
        CreateFileModalModule,
        MatTooltipModule,
        AngularEditorModule,
        FormsModule,
        MatBottomSheetModule,
        MatProgressSpinnerModule
    ]
})
export class FileModule {
}
