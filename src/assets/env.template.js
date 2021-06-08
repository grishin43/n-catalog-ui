(function () {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["homeUri"] = '${HOME_URI}';
  window["env"]["apiV1"] = '${API_V1}';
  window["env"]["production"] = '${IS_PROD}';
  window["env"]["defaultLanguage"] = '${DEFAULT_LANG}';

  window["env"]["auth"] = {
    uri: '${AUTH_URI}',
    clientId: '${AUTH_CLIENT_ID}',
    grantType: '${AUTH_GRANT_TYPE}',
    retrieveTokenUri: '${AUTH_RETRIEVE_TOKEN_URI}'
  };
})(this);
