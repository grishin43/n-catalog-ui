import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastLoaderComponent} from './components/toast-loader/toast-loader.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslateModule} from '@ngx-translate/core';
import {ToastErrorComponent} from './components/toast-error/toast-error.component';
import {ToastService} from './service/toast.service';
import {MatButtonModule} from '@angular/material/button';
import {NpButtonModule} from '../np-button/np-button.module';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';

@NgModule({
  declarations: [
    ToastLoaderComponent,
    ToastErrorComponent,
    ToastMessageComponent
  ],
  exports: [
    ToastLoaderComponent,
    ToastErrorComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatButtonModule,
    NpButtonModule
  ],
  providers: [
    ToastService
  ]
})
export class ToastModule {
}
