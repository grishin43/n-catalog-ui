import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreventProcessCloseModalComponent} from './component/prevent-process-close-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    PreventProcessCloseModalComponent
  ],
  exports: [
    PreventProcessCloseModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    NpButtonModule,
    MatProgressSpinnerModule
  ]
})
export class PreventProcessCloseModalModule {
}
