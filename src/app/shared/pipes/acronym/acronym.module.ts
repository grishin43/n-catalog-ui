import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AcronymPipe} from './acronym.pipe';

@NgModule({
  declarations: [AcronymPipe],
  exports: [AcronymPipe],
  imports: [
    CommonModule
  ]
})
export class AcronymModule { }
