import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatalogComponent} from './catalog.component';
import {CatalogRoutingModule} from './catalog-routing.module';
import {MainComponent} from './pages/main/main.component';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../../environments/environment';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {CatalogState} from './store/states/catalog.state';

@NgModule({
  declarations: [
    CatalogComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    NgxsModule.forRoot([CatalogState], {developmentMode: !environment.production}),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ]
})
export class CatalogModule {
}
