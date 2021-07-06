import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {EntitiesTabService} from '../../services/entities-tab/entities-tab.service';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'np-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {
  public file: CatalogEntityModel;

  private subscriptions = new Subscription();

  constructor(
    private activateRoute: ActivatedRoute,
    private entitiesTabService: EntitiesTabService,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.subscribeRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeRoute(): void {
    this.subscriptions.add(
      this.activateRoute.params
        .subscribe((params: Params) => {
          this.subscribeFile(params[CatalogRouteEnum._ID]);
        })
    );
  }

  private subscribeFile(fileId: string): void {
    this.subscriptions.add(
      this.apiService.getFileById(fileId)
        .subscribe((res: CatalogEntityModel) => {
          this.file = res;
          this.entitiesTabService.addEntity(this.file);
        })
    );
  }

}
