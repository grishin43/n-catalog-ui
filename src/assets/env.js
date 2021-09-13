(function () {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["homeUri"] = "http://localhost:4200";
  window["env"]["apiV1"] = "https://businesscatalogapi.bc.dev.digital.np.work/api/v1";
  window["env"]["production"] = false;
  window["env"]["defaultLanguage"] = 'ua';

  window["env"]["auth"] = {
    uri: 'https://uaa.nplf.dev.digital.np.work/auth/realms/NovaContact/protocol/openid-connect',
    clientId: 'NovaContact',
    grantType: 'authorization_code',
    retrieveTokenUri: 'https://novacontactapi.nc.dev.digital.np.work/api/v1/token',
  };
})(this);
