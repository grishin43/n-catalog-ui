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
import {GrantAccessModalComponent} from '../../../shared/components/big/grant-access-modal/component/grant-access-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {BpmnModelerService} from '../../services/bpmn-modeler/bpmn-modeler.service';

@Component({
  selector: 'np-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {
  public process: ProcessModel;
  public errorResponse: HttpErrorResponse;
  public xmlMode: boolean;
  public modelerXml: string;

  private subscriptions = new Subscription();

  constructor(
    public processAutosave: ProcessAutosaveService,
    private activateRoute: ActivatedRoute,
    private entitiesTab: EntitiesTabService,
    private api: ApiService,
    private toast: ToastService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private bpmnModeler: BpmnModelerService
  ) {
  }

  ngOnInit(): void {
    document.body.classList.add('cdk-overflow');
    this.subscribeRoute();
    this.processAutosave.checkLocalResources();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cdk-overflow');
    this.subscriptions.unsubscribe();
  }

  private subscribeRoute(): void {
    this.subscriptions.add(
      this.activateRoute.queryParams
        .subscribe((queryParams: Params) => {
          this.subscribeProcess(
            queryParams[CatalogRouteEnum._PARENT_ID],
            queryParams[CatalogRouteEnum._ID]
          );
        })
    );
  }

  private subscribeProcess(folderId: string, processId: string): void {
    this.errorResponse = undefined;
    this.subscriptions.add(
      this.api.getProcessById(folderId, processId)
        .subscribe((res: ProcessModel) => {
          this.process = res;
          this.entitiesTab.addEntity(res);
        }, (err: HttpErrorResponse) => {
          this.handleGeneralErrors(err, processId);
        })
    );
  }

  private handleGeneralErrors(err: HttpErrorResponse, processId: string): void {
    this.errorResponse = err;
    let toastErrorMessage: string;
    if (err.status === HttpStatusCodeEnum.NOT_FOUND) {
      this.entitiesTab.deleteEntity({id: processId});
      toastErrorMessage = this.translate.instant('errors.processNotFoundOrHasBeenDeleted');
    } else {
      toastErrorMessage = err.error?.message || err.message;
    }
    this.toast.showError('errors.errorOccurred', toastErrorMessage);
  }

  public openGrantAccessModal(): void {
    this.dialog.open(GrantAccessModalComponent, {
      width: '700px',
      autoFocus: false,
      data: this.process
    });
  }

  public xmlDestroyed(xml: string): void {
    this.process.activeResource.content = xml;
  }

  public toggleXmlMode(): void {
    if (!this.xmlMode) {
      this.bpmnModeler.getDiagramXml().then((res: string) => {
        this.xmlMode = true;
        this.modelerXml = res;
      });
    } else {
      this.xmlMode = false;
    }
    this.processAutosave.shouldSavedCheckout(this.modelerXml);
  }

}
