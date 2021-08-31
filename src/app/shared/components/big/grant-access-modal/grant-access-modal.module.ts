import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GrantAccessModalComponent} from './component/grant-access-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    GrantAccessModalComponent
  ],
  exports: [
    GrantAccessModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    NpButtonModule,
    MatProgressSpinnerModule
  ]
})
export class GrantAccessModalModule {
}
