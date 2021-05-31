import {NgModule} from '@angular/core';
import {NpAvatarComponent} from './component/np-avatar.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    NpAvatarComponent
  ],
  exports: [
    NpAvatarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NpAvatarModule {
}
