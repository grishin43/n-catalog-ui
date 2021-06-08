import {AuthHelper} from '../app/auth/helpers/auth.helper';

export const environment = {
  /* tslint:disable:no-string-literal */
  defaultLanguage: window['env']['defaultLanguage'] || 'ua',
  homeUri: window['env']['homeUri'] || 'http://localhost:4200',
  auth: window['env']['auth'] || AuthHelper.settings,
  apiV1: window['env']['apiV1'] || 'http://novacontactapi.nc.dev.digital.np.work/api/v1',
  production:  window['env']['production'] || true
};
