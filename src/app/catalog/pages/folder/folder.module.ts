import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FolderComponent} from './folder.component';
import {RouterModule, Routes} from '@angular/router';
import { FolderBreadcrumbsComponent } from './folder-breadcrumbs/folder-breadcrumbs.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {NpTableModule} from '../../../shared/components/np-table/np-table.module';

const routes: Routes = [
  {
    path: '',
    component: FolderComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    FolderComponent,
    FolderBreadcrumbsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NpTableModule
  ]
})
export class FolderModule {
}
