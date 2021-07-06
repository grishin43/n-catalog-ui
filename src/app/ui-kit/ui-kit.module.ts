import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiKitComponent} from './ui-kit.component';
import {RouterModule, Routes} from '@angular/router';
import {NpButtonModule} from '../shared/components/small/np-button/np-button.module';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NpInputModule} from '../shared/components/small/np-input/np-input.module';
import {TranslateModule} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NpStatusPillModule} from '../shared/components/small/np-status-pill/np-status-pill.module';
import {NpAvatarModule} from '../shared/components/small/np-avatar/np-avatar.module';

const routes: Routes = [
  {
    path: '',
    component: UiKitComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    UiKitComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NpButtonModule,
    MatIconModule,
    MatMenuModule,
    NpInputModule,
    TranslateModule,
    MatTooltipModule,
    NpStatusPillModule,
    NpAvatarModule
  ]
})
export class UiKitModule {
}
