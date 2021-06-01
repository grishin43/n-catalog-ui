import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NpTableComponent} from './component/np-table.component';
import {MatTableModule} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';
import {ToStringArrayModule} from '../../pipes/to-string-array/to-string-array.module';
import {NpStatusPillModule} from '../np-status-pill/np-status-pill.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {NpPersonsModule} from '../np-persons/np-persons.module';

@NgModule({
  declarations: [
    NpTableComponent
  ],
  exports: [
    NpTableComponent
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
        NpPersonsModule
    ]
})
export class NpTableModule {
}
