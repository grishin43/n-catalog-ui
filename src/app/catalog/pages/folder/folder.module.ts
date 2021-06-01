import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FolderComponent} from './folder.component';
import {RouterModule, Routes} from '@angular/router';

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
    FolderComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class FolderModule {
}
