import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NpPersonsComponent} from './component/np-persons.component';
import {NpAvatarModule} from '../np-avatar/np-avatar.module';
import {AcronymModule} from '../../../pipes/acronym/acronym.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    NpPersonsComponent
  ],
  exports: [
    NpPersonsComponent
  ],
  imports: [
    CommonModule,
    NpAvatarModule,
    AcronymModule,
    MatTooltipModule
  ]
})
export class NpPersonsModule {
}
