import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchResultsComponent} from './search-results.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {SafeHtmlModule} from '../../../shared/pipes/safe-html/safe-html.module';
import {EntityTableModule} from '../../../shared/components/big/entities-table/entity-table.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: SearchResultsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatIconModule,
    SafeHtmlModule,
    EntityTableModule,
    NgxPaginationModule,
    MatProgressSpinnerModule
  ]
})
export class SearchResultsModule {
}
