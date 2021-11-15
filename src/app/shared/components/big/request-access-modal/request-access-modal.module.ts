import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RequestAccessModalComponent} from './component/request-access-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {NpAvatarModule} from '../../small/np-avatar/np-avatar.module';
import {UserInfoTooltipModule} from '../../../directives/user-info-tooltip/user-info-tooltip.module';
import {AcronymModule} from '../../../pipes/acronym/acronym.module';

@NgModule({
  declarations: [
    RequestAccessModalComponent
  ],
  exports: [
    RequestAccessModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    NpButtonModule,
    NpAvatarModule,
    UserInfoTooltipModule,
    AcronymModule
  ]
})
export class RequestAccessModalModule {
}
