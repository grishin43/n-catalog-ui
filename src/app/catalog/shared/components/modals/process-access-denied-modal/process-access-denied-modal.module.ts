import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProcessAccessDeniedModalComponent} from './component/process-access-denied-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';
import {NpButtonModule} from '../../general/np-button/np-button.module';
import {NpAvatarModule} from '../../general/np-avatar/np-avatar.module';
import {UserInfoTooltipModule} from '../../../directives/user-info-tooltip/user-info-tooltip.module';
import {AcronymModule} from '../../../pipes/acronym/acronym.module';

@NgModule({
  declarations: [
    ProcessAccessDeniedModalComponent
  ],
  exports: [
    ProcessAccessDeniedModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    NpButtonModule,
    NpAvatarModule,
    UserInfoTooltipModule,
    AcronymModule
  ]
})
export class ProcessAccessDeniedModalModule {
}
