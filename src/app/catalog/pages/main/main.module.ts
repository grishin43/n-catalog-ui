import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {FolderComponent} from './folder/folder.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatRippleModule} from '@angular/material/core';
import {NpButtonModule} from '../../../shared/components/small/np-button/np-button.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {SafeHtmlModule} from '../../../shared/pipes/safe-html/safe-html.module';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule, Routes} from '@angular/router';
import {EntityTableModule} from '../../../shared/components/big/entities-table/entity-table.module';
import {CreateEntityButtonModule} from '../../../shared/components/big/create-entity-button/create-entity-button.module';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    MainComponent,
    FolderComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MatRippleModule,
    NpButtonModule,
    MatMenuModule,
    MatIconModule,
    SafeHtmlModule,
    MatButtonModule,
    EntityTableModule,
    CreateEntityButtonModule
  ]
})
export class MainModule {
}
