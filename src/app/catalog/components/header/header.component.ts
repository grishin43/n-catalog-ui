import {Component, OnInit} from '@angular/core';
import {MatRippleHelper} from '../../helpers/mat-ripple.helper';
import {EntitiesTabService} from '../../services/entities-tab/entities-tab.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {NavigationEnd, Router, Event} from '@angular/router';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {AuthService} from '../../../auth/services/auth/auth.service';
import {UrlHelper} from '../../helpers/url.helper';
import {ProcessModel} from '../../../models/domain/process.model';

@Component({
  selector: 'np-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public catalogProcesses: BehaviorSubject<ProcessModel[]>;
  public currentId: string;
  public searchFormStretched: boolean;
  public hideRightBar: boolean;

  private subscriptions = new Subscription();

  constructor(
    private entitiesTabService: EntitiesTabService,
    private router: Router,
    private authService: AuthService
  ) {
    this.subscribeRouteChanges();
  }

  ngOnInit(): void {
    this.setupCatalogEntities();
  }

  private setupCatalogEntities(): void {
    this.catalogProcesses = this.entitiesTabService.processes;
  }

  private subscribeRouteChanges(): void {
    this.subscriptions.add(
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.setupCurrentEntityId(event.url);
        }
      })
    );
  }

  private setupCurrentEntityId(url: string): void {
    if (url.match(`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`)) {
      this.currentId = UrlHelper.getParameterByName(CatalogRouteEnum._ID, url);
    } else {
      this.currentId = undefined;
    }
  }

  public onDeleteClicked(event: MouseEvent, entity: ProcessModel): void {
    event.stopPropagation();
    event.preventDefault();
    this.entitiesTabService.deleteEntity(entity);
  }

  public openProcess(process: ProcessModel): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
      {
        queryParams: {
          [CatalogRouteEnum._ID]: process.id,
          [CatalogRouteEnum._NAME]: process.name,
          [CatalogRouteEnum._PARENT_ID]: process.parent.id
        }
      }
    );
  }

  public logout(): void {
    this.authService.logout();
  }

}
