import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatalogComponent} from './catalog.component';
import {CatalogRoutingModule} from './catalog-routing.module';
import {MainComponent} from './pages/main/main.component';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../../environments/environment';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {CatalogState} from './store/states/catalog.state';
import {HeaderComponent} from './components/header/header.component';
import {NpInputModule} from '../shared/components/np-input/np-input.module';
import {TranslateModule} from '@ngx-translate/core';
import {NpAvatarModule} from '../shared/components/np-avatar/np-avatar.module';
import {MatRippleModule} from '@angular/material/core';
import {NpButtonModule} from '../shared/components/np-button/np-button.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { CreateEntityComponent } from './pages/main/create-entity/create-entity.component';
import { FolderComponent } from './pages/main/folder/folder.component';
import {SafeHtmlModule} from '../shared/pipes/safe-html/safe-html.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    CatalogComponent,
    MainComponent,
    HeaderComponent,
    CreateEntityComponent,
    FolderComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    NgxsModule.forRoot([CatalogState], {developmentMode: !environment.production}),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NpInputModule,
    TranslateModule,
    NpAvatarModule,
    MatRippleModule,
    NpButtonModule,
    MatMenuModule,
    MatIconModule,
    SafeHtmlModule,
    MatButtonModule
  ]
})
export class CatalogModule {
}
