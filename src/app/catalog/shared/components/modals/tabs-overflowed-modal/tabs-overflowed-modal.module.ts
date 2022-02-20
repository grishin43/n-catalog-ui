import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsOverflowedModalComponent} from './component/tabs-overflowed-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {NpButtonModule} from '../../general/np-button/np-button.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    TabsOverflowedModalComponent
  ],
  exports: [
    TabsOverflowedModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    NpButtonModule,
    MatButtonModule
  ]
})
export class TabsOverflowedModalModule {
}
