import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiKitComponent} from './ui-kit.component';
import {RouterModule, Routes} from '@angular/router';
import {NpButtonModule} from '../shared/np-button/np-button.module';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

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
    MatMenuModule
  ]
})
export class UiKitModule {
}
