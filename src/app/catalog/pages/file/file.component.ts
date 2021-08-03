import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {EntitiesTabService} from '../../services/entities-tab/entities-tab.service';
import {ApiService} from '../../services/api/api.service';
import {CatalogEntityEnum} from '../../models/catalog-entity.enum';
import {NpStatusPillEnum} from '../../../shared/components/small/np-status-pill/models/np-status-pill.enum';
import {CatalogEntityPermissionEnum} from '../../models/catalog-entity-permission.enum';

@Component({
  selector: 'np-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {
  public file: CatalogEntityModel;
  public showSavedLabel: boolean;

  private subscriptions = new Subscription();

  constructor(
    private activateRoute: ActivatedRoute,
    private entitiesTabService: EntitiesTabService,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    document.body.classList.add('cdk-overflow');
    this.subscribeRoute();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cdk-overflow');
    this.subscriptions.unsubscribe();
  }

  private subscribeRoute(): void {
    this.subscriptions.add(
      this.activateRoute.queryParams
        .subscribe((queryParams: Params) => {
          this.subscribeFile(queryParams[CatalogRouteEnum._ID]);
        })
    );
  }

  private subscribeFile(fileId: string): void {
    this.subscriptions.add(
      this.apiService.getFileById(fileId)
        .subscribe((res: CatalogEntityModel) => {
          if (res) {
            this.file = res;
            this.entitiesTabService.addEntity(this.file);
          } else {
            // TODO
            this.file = {
              id: fileId,
              name: 'Новий файл',
              type: CatalogEntityEnum.PROCESS,
              status: NpStatusPillEnum.DRAFT,
              link: '../../../assets/bpmn/newDiagram.bpmn',
              permissions: CatalogEntityPermissionEnum.READ
            };
            this.entitiesTabService.addEntity(this.file);
          }
        })
    );
  }

}
