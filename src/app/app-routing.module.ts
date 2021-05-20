import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRouteEnum} from './models/app-route.enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppRouteEnum.CATALOG,
    pathMatch: 'full'
  },
  {
    path: AppRouteEnum.UI_KIT,
    loadChildren: () => import('./ui-kit/ui-kit.module').then(m => m.UiKitModule)
  },
  {
    path: AppRouteEnum.CATALOG,
    loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
