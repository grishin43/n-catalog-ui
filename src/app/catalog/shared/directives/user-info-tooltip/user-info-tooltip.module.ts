import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserInfoTooltipDirective} from './directive/user-info-tooltip.directive';
import {UserInfoTooltipComponent} from './component/user-info-tooltip.component';
import {NpAvatarModule} from '../../components/general/np-avatar/np-avatar.module';
import {AcronymModule} from '../../pipes/acronym/acronym.module';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    UserInfoTooltipDirective,
    UserInfoTooltipComponent
  ],
  exports: [
    UserInfoTooltipDirective
  ],
  entryComponents: [
    UserInfoTooltipComponent
  ],
  imports: [
    CommonModule,
    NpAvatarModule,
    AcronymModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class UserInfoTooltipModule {
}
