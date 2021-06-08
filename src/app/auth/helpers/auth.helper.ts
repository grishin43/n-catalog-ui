export class AuthHelper {

  public static get settings(): any {
    return {
      uri: 'http://uaa.nplf.dev.digital.np.work/auth/realms/NovaContact/protocol/openid-connect',
      clientId: 'NovaContact',
      grantType: 'authorization_code',
      retrieveTokenUri: 'http://novacontactapi.nc.dev.digital.np.work/api/v1/token'
    };
  }

}
