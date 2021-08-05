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
  selector: 'np-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {
  public process: CatalogEntityModel;

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
          this.subscribeProcess(queryParams[CatalogRouteEnum._ID], queryParams[CatalogRouteEnum._NAME]);
        })
    );
  }

  private subscribeProcess(processId: string, processName: string): void {
    this.subscriptions.add(
      this.apiService.getProcessById(processId)
        .subscribe((res: CatalogEntityModel) => {
          if (res) {
            this.process = res;
            this.entitiesTabService.addEntity(this.process);
          } else {
            // TODO
            this.process = {
              id: processId,
              name: processName || 'Новий процес',
              type: CatalogEntityEnum.PROCESS,
              status: NpStatusPillEnum.DRAFT,
              link: '../../../assets/bpmn/newDiagram.bpmn',
              permissions: CatalogEntityPermissionEnum.READ
            };
            this.entitiesTabService.addEntity(this.process);
          }
        })
    );
  }

}
