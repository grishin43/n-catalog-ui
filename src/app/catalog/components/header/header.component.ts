import {Component, OnInit} from '@angular/core';
import {MatRippleHelper} from '../../helpers/mat-ripple.helper';
import {EntitiesTabService} from '../../services/entities-tab.service';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {AppRouteEnum} from '../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';

@Component({
  selector: 'np-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public activeEntity: BehaviorSubject<CatalogEntityModel>;

  constructor(
    private entitiesTabService: EntitiesTabService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activeEntity = this.entitiesTabService.entity;
  }

  public onDeleteClicked(): void {
    this.entitiesTabService.deleteEntity();
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.MAIN}`]);
  }

  public openFile(): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${this.activeEntity.value.id}`]);
  }

}
