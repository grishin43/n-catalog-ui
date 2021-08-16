import {KeycloakService} from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'https://uaa.nplf.dev.digital.np.work/auth',
        realm: 'BusinessCatalog',
        clientId: 'web-app',
      },
      loadUserProfileAtStartUp: true
    });
}
