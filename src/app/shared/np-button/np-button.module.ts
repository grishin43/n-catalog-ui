import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NpButtonComponent} from './np-button.component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    NpButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    NpButtonComponent
  ]
})
export class NpButtonModule {
}
