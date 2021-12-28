import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AskVersionSaveModalComponent} from './components/ask-version-save-modal/ask-version-save-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AskVersionSaveModalComponent
  ],
  exports: [
    AskVersionSaveModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    NpButtonModule,
    MatButtonModule
  ]
})
export class AskVersionSaveModalModule {
}
