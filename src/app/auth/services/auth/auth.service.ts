import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Cookie} from 'ng2-cookies';
import {Router} from '@angular/router';
import {AuthToken} from '../../models/authToken.model';
import {environment} from '../../../../environments/environment';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../catalog/models/catalog-route.enum';

interface TokenRequest {
  grant_type: string;
  client_id: string;
  redirect_uri: string;
  code: string;
}

// ToDo replace login logic with keyloack.js library for Angular
@Injectable()
export class AuthService {
  private readonly authTokenKey = 'auth_token';
  private readonly authIdTokenKey = 'id_token';
  // ToDo move to config
  private redirectAfterLoginUri = environment.homeUri + '/user';

  private authToken: AuthToken;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.getSavedToken();
  }

  private getSavedToken(): void {
    const fetchToken = Cookie.get(this.authTokenKey);
    if (!!fetchToken) {
      this.authToken = JSON.parse(fetchToken) as AuthToken;
    }
  }

  public login(): void {
    window.location.href = environment.auth.uri +
      '/auth' +
      '?response_type=code' +
      '&&scope=openid%20write%20read' +
      '&client_id=' + environment.auth.clientId +
      '&redirect_uri=' + this.redirectAfterLoginUri;
  }

  retrieveToken(code: string): void {
    const tokenRequest: TokenRequest = {
      grant_type: environment.auth.grantType,
      client_id: environment.auth.clientId,
      redirect_uri: this.redirectAfterLoginUri,
      code
    };

    this.httpClient.post<AuthToken>(environment.auth.retrieveTokenUri, tokenRequest)
      .subscribe(
        data => this.saveToken(data),
        () => alert('[AuthService] Invalid Credentials')
      );
  }

  private saveToken(token: AuthToken): void {
    this.authToken = token;
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set(this.authTokenKey, JSON.stringify(token), expireDate);
    Cookie.set(this.authIdTokenKey, token.id_token, expireDate);
    console.log('[AuthService] Obtained Access token');
    this.openHomePage();
  }

  getToken(): string {
    return this.authToken?.access_token;
  }

  public isLoggedIn(): boolean {
    return !!this.authToken;
  }

  public logout(): void {
    Cookie.delete(this.authTokenKey);
    Cookie.delete(this.authIdTokenKey);
    const logoutURL = environment.auth.uri +
      '/logout' +
      '?redirect_uri=' + this.redirectAfterLoginUri;

    this.authToken = null;
    window.location.href = logoutURL;
  }

  public openHomePage(): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.MAIN}`])
      .then((data) => console.log('is opened', data))
      .catch((err) => console.error('open page router eerror', err));
  }
}
