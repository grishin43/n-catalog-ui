import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NpButtonModule} from '../../general/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SaveVersionModalComponent} from './component/save-version-modal.component';
import {MaxLengthModule} from '../../../directives/max-length/max-length.module';

@NgModule({
  declarations: [
    SaveVersionModalComponent
  ],
  exports: [
    SaveVersionModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    NpButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MaxLengthModule
  ]
})
export class SaveVersionModalModule {
}
