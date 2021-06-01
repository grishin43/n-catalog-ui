import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatalogComponent} from './catalog.component';
import {CatalogRoutingModule} from './catalog-routing.module';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../../environments/environment';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {CatalogState} from './store/states/catalog.state';
import {HeaderComponent} from './components/header/header.component';
import {NpInputModule} from '../shared/components/np-input/np-input.module';
import {MatRippleModule} from '@angular/material/core';
import {NpAvatarModule} from '../shared/components/np-avatar/np-avatar.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    CatalogComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    NgxsModule.forRoot([CatalogState], {developmentMode: !environment.production}),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NpInputModule,
    MatRippleModule,
    NpAvatarModule,
    TranslateModule
  ]
})
export class CatalogModule {
}
