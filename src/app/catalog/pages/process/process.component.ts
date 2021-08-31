import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {EntitiesTabService} from '../../services/entities-tab/entities-tab.service';
import {ApiService} from '../../services/api/api.service';
import {ProcessAutosaveService} from '../../services/process-autosave/process-autosave.service';
import {ProcessModel} from '../../../models/domain/process.model';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpStatusCodeEnum} from '../../../models/http-status-code.enum';
import {ToastService} from '../../../shared/components/small/toast/service/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'np-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {
  public process: ProcessModel;

  private subscriptions = new Subscription();

  constructor(
    private activateRoute: ActivatedRoute,
    private entitiesTab: EntitiesTabService,
    private api: ApiService,
    public processAutosave: ProcessAutosaveService,
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    document.body.classList.add('cdk-overflow');
    this.subscribeRoute();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cdk-overflow');
    this.processAutosave.destroy();
    this.subscriptions.unsubscribe();
  }

  private subscribeRoute(): void {
    this.subscriptions.add(
      this.activateRoute.queryParams
        .subscribe((queryParams: Params) => {
          this.subscribeProcess(
            queryParams[CatalogRouteEnum._ID],
            queryParams[CatalogRouteEnum._PARENT_ID]
          );
        })
    );
  }

  private subscribeProcess(processId: string, folderId: string): void {
    this.subscriptions.add(
      this.api.getProcessById(folderId, processId)
        .subscribe((res: ProcessModel) => {
          this.process = res;
          this.entitiesTab.addEntity(res);
          this.runAutoSave(res);
        }, (err: HttpErrorResponse) => {
          let errorMessage: string;
          if (err.status === HttpStatusCodeEnum.NOT_FOUND) {
            this.entitiesTab.deleteEntity({id: processId});
            errorMessage = this.translate.instant('errors.processNotFoundOrHasBeenDeleted');
          } else {
            errorMessage = err.message;
          }
          this.toast.showError('errors.errorOccurred', errorMessage);
        })
    );
  }

  private runAutoSave(process: ProcessModel): void {
    this.processAutosave.destroy();
    this.processAutosave.init(process);
  }

}
