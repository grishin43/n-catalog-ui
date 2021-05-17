import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogComponent} from './catalog.component';
import {CatalogRouteEnum} from './models/catalog-route.enum';
import {MainComponent} from './pages/main/main.component';

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
        component: MainComponent
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
