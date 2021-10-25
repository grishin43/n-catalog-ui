import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SaveVersionModalComponent} from './component/save-version-modal.component';

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
    MatInputModule
  ]
})
export class SaveVersionModalModule {
}
