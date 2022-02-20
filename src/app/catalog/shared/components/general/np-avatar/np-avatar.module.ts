import {NgModule} from '@angular/core';
import {NpAvatarComponent} from './component/np-avatar.component';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AcronymModule} from '../../../pipes/acronym/acronym.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    NpAvatarComponent
  ],
  exports: [
    NpAvatarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    AcronymModule,
    TranslateModule
  ]
})
export class NpAvatarModule {
}
