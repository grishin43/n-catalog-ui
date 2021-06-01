import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogComponent} from './catalog.component';
import {CatalogRouteEnum} from './models/catalog-route.enum';

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
    children: [
      {
        path: '',
        redirectTo: CatalogRouteEnum.MAIN,
        pathMatch: 'full'
      },
      {
        path: CatalogRouteEnum.MAIN,
        loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)
      },
      {
        path: `${CatalogRouteEnum.FOLDER}/:${CatalogRouteEnum.ID}`,
        loadChildren: () => import('./pages/folder/folder.module').then(m => m.FolderModule)
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {
}
