import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateEntityModalComponent} from './component/create-entity-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NpButtonModule} from '../../general/np-button/np-button.module';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CreateEntityModalComponent
  ],
  exports: [
    CreateEntityModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NpButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class CreateEntityModalModule {
}
