import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateEntityButtonComponent} from './component/create-entity-button.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {CreateEntityModalModule} from '../create-entity-modal/create-entity-modal.module';

@NgModule({
  declarations: [
    CreateEntityButtonComponent
  ],
  exports: [
    CreateEntityButtonComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    CreateEntityModalModule
  ]
})
export class CreateEntityButtonModule {
}
