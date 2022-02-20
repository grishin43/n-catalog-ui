import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToStringArrayPipe} from './to-string-array.pipe';

@NgModule({
  declarations: [ToStringArrayPipe],
  exports: [ToStringArrayPipe],
  imports: [
    CommonModule
  ]
})
export class ToStringArrayModule { }
