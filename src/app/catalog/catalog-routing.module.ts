import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogComponent} from './catalog.component';
import {CatalogRouteEnum} from './models/catalog-route.enum';
import {ProcessActivateGuard} from './guards/process-activate-guard';
import {ProcessDeactivateGuard} from './guards/process-deactivate-guard';

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
        path: `${CatalogRouteEnum.FOLDER}/:${CatalogRouteEnum._ID}`,
        loadChildren: () => import('./pages/folder/folder.module').then(m => m.FolderModule)
      },
      {
        path: `${CatalogRouteEnum.PROCESS}`,
        loadChildren: () => import('./pages/process/process.module').then(m => m.ProcessModule),
        // canActivate: [ProcessActivateGuard],
        canDeactivate: [ProcessDeactivateGuard],
        // runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: `${CatalogRouteEnum.SEARCH_RESULTS}/:${CatalogRouteEnum._QUERY}/:${CatalogRouteEnum._TYPE}`,
        loadChildren: () => import('./pages/search-results/search-results.module').then(m => m.SearchResultsModule)
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
