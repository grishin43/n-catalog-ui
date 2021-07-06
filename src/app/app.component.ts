import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'np-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'catalog-small';

  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang(environment.defaultLanguage);
    translateService.use(environment.defaultLanguage);
  }
}
