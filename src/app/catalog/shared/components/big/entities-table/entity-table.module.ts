import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntitiesTableComponent} from './component/entities-table.component';
import {MatTableModule} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';
import {ToStringArrayModule} from '../../../pipes/to-string-array/to-string-array.module';
import {NpStatusPillModule} from '../../general/np-status-pill/np-status-pill.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {NpPersonsModule} from '../../general/np-persons/np-persons.module';
import {TableActionsService} from './services/table-actions/table-actions.service';
import {NpButtonModule} from '../../general/np-button/np-button.module';
import {MatRippleModule} from '@angular/material/core';
import {RenameEntityModalModule} from '../../modals/rename-entity-modal/rename-entity-modal.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RequestAccessModalModule} from '../../modals/request-access-modal/request-access-modal.module';

@NgModule({
  declarations: [
    EntitiesTableComponent
  ],
  exports: [
    EntitiesTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    ToStringArrayModule,
    NpStatusPillModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NpPersonsModule,
    NpButtonModule,
    MatRippleModule,
    RenameEntityModalModule,
    MatProgressSpinnerModule,
    RequestAccessModalModule
  ],
  providers: [
    TableActionsService
  ]
})
export class EntityTableModule {
}
