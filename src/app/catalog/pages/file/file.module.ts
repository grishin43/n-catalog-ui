import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileComponent} from './file.component';
import {RouterModule, Routes} from '@angular/router';
import {FileTopToolbarComponent} from './file-top-toolbar/file-top-toolbar.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: FileComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    FileComponent,
    FileTopToolbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class FileModule {
}
