import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProcessComponent} from './process.component';
import {RouterModule, Routes} from '@angular/router';
import {ProcessToolbarComponent} from './process-toolbar/process-toolbar.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {NpButtonModule} from '../../../shared/components/small/np-button/np-button.module';
import {BpmnEditorComponent} from './bpmn-editor/bpmn-editor.component';
import {ToolbarActionBtnComponent} from './process-toolbar/toolbar-action-btn/toolbar-action-btn.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {WysiwygEditorComponent} from './wysiwyg-editor/wysiwyg-editor.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FormsModule} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: ProcessComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    ProcessComponent,
    ProcessToolbarComponent,
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
    MatTooltipModule,
    AngularEditorModule,
    FormsModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule
  ]
})
export class ProcessModule {
}