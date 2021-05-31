import {NgModule} from '@angular/core';
import {NpStatusPillComponent} from './component/np-status-pill.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    NpStatusPillComponent
  ],
  imports: [
    TranslateModule
  ],
  exports: [
    NpStatusPillComponent
  ]
})
export class NpStatusPillModule {
}
