import {NgModule} from '@angular/core';
import {NpInputComponent} from './component/np-input.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    NpInputComponent
  ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        MatIconModule,
        MatAutocompleteModule
    ],
  exports: [
    NpInputComponent
  ]
})
export class NpInputModule {
}
