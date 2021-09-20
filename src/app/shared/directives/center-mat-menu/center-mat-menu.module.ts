import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CenterMatMenuDirective} from './directive/center-mat-menu.directive';

@NgModule({
  declarations: [
    CenterMatMenuDirective
  ],
  exports: [
    CenterMatMenuDirective
  ],
  imports: [
    CommonModule
  ]
})
export class CenterMatMenuModule {
}
