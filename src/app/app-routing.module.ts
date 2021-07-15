import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRouteEnum} from './models/app-route.enum';
import {AuthGuard} from './auth/services/auth-guard/authGuard';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppRouteEnum.CATALOG,
    pathMatch: 'full'
  },
  {
    path: AppRouteEnum.CATALOG,
    canActivate: [AuthGuard],
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
