import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatErrorsDirective} from './directive/mat-errors.directive';
import {MatErrorsComponent} from './component/mat-errors.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    MatErrorsDirective,
    MatErrorsComponent
  ],
  exports: [
    MatErrorsDirective
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    TranslateModule
  ],
  entryComponents: [
    MatErrorsComponent
  ]
})
export class MatErrorsModule {
}
