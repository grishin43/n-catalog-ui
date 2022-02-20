import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FolderActionsButtonComponent} from './component/folder-actions-button.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {CreateEntityModalModule} from '../../modals/create-entity-modal/create-entity-modal.module';

@NgModule({
  declarations: [
    FolderActionsButtonComponent
  ],
  exports: [
    FolderActionsButtonComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    CreateEntityModalModule
  ]
})
export class FolderActionsButtonModule {
}
