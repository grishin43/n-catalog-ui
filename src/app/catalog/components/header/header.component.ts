import {Component, OnInit} from '@angular/core';
import {MatRippleHelper} from '../../helpers/mat-ripple.helper';
import {EntitiesTabService} from '../../services/entities-tab/entities-tab.service';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {NavigationEnd, Router, Event} from '@angular/router';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {AuthService} from '../../../auth/services/auth/auth.service';

@Component({
  selector: 'np-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public catalogEntities: BehaviorSubject<CatalogEntityModel[]>;
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
    this.catalogEntities = this.entitiesTabService.entities;
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
    if (url.match(`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}`)) {
      this.currentId = url.split('/').pop();
    } else {
      this.currentId = undefined;
    }
  }

  public onDeleteClicked(event: MouseEvent, file: CatalogEntityModel): void {
    event.stopPropagation();
    event.preventDefault();
    this.entitiesTabService.deleteEntity(file);
  }

  public openFile(file: CatalogEntityModel): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${file.id}`]);
  }

  public logout(): void {
    this.authService.logout();
  }

}
