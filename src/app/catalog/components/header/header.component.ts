import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatRippleHelper} from '../../helpers/mat-ripple.helper';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {AuthService} from '../../../auth/services/auth/auth.service';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';

@Component({
  selector: 'np-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public processId: string;
  public folderId: string;
  public searchFormStretched = new BehaviorSubject<boolean>(false);
  public hideRightBar: boolean;
  public userFirstLastName: string;
  public showAllCrosses: boolean;

  private subs = new Subscription();

  constructor(
    private activateRoute: ActivatedRoute,
    private auth: AuthService,
    private kc: KeycloakService
  ) {
    this.subscribeRouteChanges();
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getUserProfile(): void {
    this.kc.loadUserProfile().then((res: KeycloakProfile) => {
      this.patchUserFirstLastName(res);
    });
  }

  private patchUserFirstLastName(kp: KeycloakProfile): void {
    if (kp?.firstName?.trim().length) {
      const firstNameArr = kp.firstName.split(' ');
      if (firstNameArr?.length > 1) {
        this.userFirstLastName = `${firstNameArr[0]} ${firstNameArr[1]}`;
      } else {
        this.userFirstLastName = `${kp.firstName} ${kp.lastName}`;
      }
    } else {
      this.userFirstLastName = undefined;
    }
  }

  private subscribeRouteChanges(): void {
    this.subs.add(
      this.activateRoute.queryParams
        .subscribe((queryParams: Params) => {
          this.processId = queryParams[CatalogRouteEnum._ID];
          this.folderId = queryParams[CatalogRouteEnum._PARENT_ID];
        })
    );
  }

  public get isProcessPath(): boolean {
    return !!this.processId && !!this.folderId;
  }

  public logout(): void {
    this.auth.logout();
  }

}
