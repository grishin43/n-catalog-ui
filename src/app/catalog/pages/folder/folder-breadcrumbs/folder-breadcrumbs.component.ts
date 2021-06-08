import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {ContentHelper} from '../../../helpers/content.helper';

@Component({
  selector: 'np-folder-breadcrumbs',
  templateUrl: './folder-breadcrumbs.component.html',
  styleUrls: ['./folder-breadcrumbs.component.scss']
})
export class FolderBreadcrumbsComponent implements OnInit, OnDestroy {
  public folder: CatalogEntityModel;
  private subscription: Subscription;

  constructor(
    private activateRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe((params: Params) => {
      this.folder = ContentHelper.getFolderById(params[CatalogRouteEnum._ID]);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onCreateFolderClicked(event: MouseEvent): void {
    // TODO
  }

  public onCreateFileClicked(event: MouseEvent): void {
    // TODO
  }

}
