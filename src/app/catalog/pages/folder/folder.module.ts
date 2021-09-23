import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FolderComponent} from './folder.component';
import {RouterModule, Routes} from '@angular/router';
import {FolderBreadcrumbsComponent} from './components/folder-breadcrumbs/folder-breadcrumbs.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {EntityTableModule} from '../../../shared/components/big/entities-table/entity-table.module';
import {MatRippleModule} from '@angular/material/core';
import {NpButtonModule} from '../../../shared/components/small/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FolderActionsButtonModule} from '../../../shared/components/big/folder-actions-button/folder-actions-button.module';
import {CantDeleteFolderModalComponent} from './components/cant-delete-folder-modal/cant-delete-folder-modal.component';
import {MatDialogModule} from '@angular/material/dialog';

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
    FolderBreadcrumbsComponent,
    CantDeleteFolderModalComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    EntityTableModule,
    MatRippleModule,
    NpButtonModule,
    MatProgressSpinnerModule,
    FolderActionsButtonModule,
    MatDialogModule
  ]
})
export class FolderModule {
}
