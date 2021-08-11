import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RenameEntityModalComponent} from './component/rename-entity-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NpButtonModule} from '../../small/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    RenameEntityModalComponent
  ],
  exports: [
    RenameEntityModalComponent
  ],
  entryComponents: [
    RenameEntityModalComponent
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
export class RenameEntityModalModule {
}
