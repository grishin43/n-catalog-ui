import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatalogComponent} from './catalog.component';
import {CatalogRoutingModule} from './catalog-routing.module';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../../environments/environment';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {CatalogState} from './store/states/catalog.state';
import {HeaderComponent} from './components/header/header.component';
import {NpInputModule} from '../shared/components/small/np-input/np-input.module';
import {MatRippleModule} from '@angular/material/core';
import {NpAvatarModule} from '../shared/components/small/np-avatar/np-avatar.module';
import {TranslateModule} from '@ngx-translate/core';
import {HeaderSearchComponent} from './components/header/header-search/header-search.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {EntitiesTabService} from './services/entities-tab/entities-tab.service';
import {ApiService} from './services/api/api.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SearchService} from './services/search/search.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BpmnToolbarService} from './services/bpmn-toolbar/bpmn-toolbar.service';
import {BpmnModelerService} from './services/bpmn-modeler/bpmn-modeler.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {ProcessAutosaveService} from './services/process-autosave/process-autosave.service';
import {ToastModule} from '../shared/components/small/toast/toast.module';
import {GrantAccessModalModule} from '../shared/components/big/grant-access-modal/grant-access-modal.module';
import {ProcessAccessDeniedModalModule} from '../shared/components/big/process-access-denied-modal/process-access-denied-modal.module';
import {ProcessActivateGuard} from './guards/process-activate-guard';
import {ProcessDeactivateGuard} from './guards/process-deactivate-guard';
import {PreventProcessCloseModalModule} from '../shared/components/big/prevent-process-close-modal/prevent-process-close-modal.module';
import {HeaderTabsComponent} from './components/header/header-tabs/header-tabs.component';
import {AcronymModule} from '../shared/pipes/acronym/acronym.module';
import {CenterMatMenuModule} from '../shared/directives/center-mat-menu/center-mat-menu.module';

@NgModule({
  declarations: [
    CatalogComponent,
    HeaderComponent,
    HeaderSearchComponent,
    HeaderTabsComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    NgxsModule.forRoot([CatalogState], {developmentMode: !environment.production}),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NpInputModule,
    MatRippleModule,
    NpAvatarModule,
    TranslateModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    ToastModule,
    GrantAccessModalModule,
    ProcessAccessDeniedModalModule,
    PreventProcessCloseModalModule,
    AcronymModule,
    CenterMatMenuModule
  ],
  providers: [
    EntitiesTabService,
    ApiService,
    SearchService,
    BpmnToolbarService,
    BpmnModelerService,
    ProcessAutosaveService,
    ProcessActivateGuard,
    ProcessDeactivateGuard
  ]
})
export class CatalogModule {
}
