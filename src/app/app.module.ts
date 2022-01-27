import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHelper} from './helpers/translate.helper';
import {AuthorizationInterceptor} from './auth/services/authorization-interceptor/authorization-interceptor.service';
import {initializeKeycloak} from './auth/keycloak/keycloak.intitalizer';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {HttpErrorsInterceptorService} from './services/httpErrorsInterceptor/httpErrors.interceptor.service';
import {AuthService} from './auth/services/auth/auth.service';
import {AuthComponent} from './auth/auth.component';
import {registerLocaleData} from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import {ToastLoaderComponent} from './toast/components/toast-loader/toast-loader.component';
import {ToastErrorComponent} from './toast/components/toast-error/toast-error.component';
import {ToastMessageComponent} from './toast/components/toast-message/toast-message.component';
import {ToastService} from './toast/service/toast.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {NpButtonModule} from './shared/components/small/np-button/np-button.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';

registerLocaleData(localeUk, 'uk');

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ToastLoaderComponent,
    ToastErrorComponent,
    ToastMessageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (TranslateHelper.createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    KeycloakAngularModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    NpButtonModule
  ],
  providers: [
    AuthService,
    ToastService,
    {provide: LOCALE_ID, useValue: 'uk'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
