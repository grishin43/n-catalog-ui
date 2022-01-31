import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaxLengthDirective} from './directive/max-length.directive';

@NgModule({
  declarations: [
    MaxLengthDirective
  ],
  exports: [
    MaxLengthDirective
  ],
  imports: [
    CommonModule
  ]
})
export class MaxLengthModule {
}
