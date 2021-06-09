import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ContentHelper} from '../../helpers/content.helper';
import {EntitiesTabService} from '../../services/entities-tab.service';

@Component({
  selector: 'np-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {
  public file: CatalogEntityModel;

  private subscription: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    private entitiesTabService: EntitiesTabService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.activateRoute.params
      .subscribe((params: Params) => {
        this.file = ContentHelper.getFileById(params[CatalogRouteEnum._ID]);
        this.entitiesTabService.addEntity(this.file);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
