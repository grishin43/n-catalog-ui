import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateFileModalComponent} from './component/create-file-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CreateFileModalComponent
  ],
  exports: [
    CreateFileModalComponent
  ],
  entryComponents: [
    CreateFileModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    NpButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class CreateFileModalModule {
}
