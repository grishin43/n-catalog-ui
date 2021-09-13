import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
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
import {ProcessAccessDeniedModalComponent} from '../../../shared/components/big/process-access-denied-modal/component/process-access-denied-modal.component';

@Component({
  selector: 'np-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {
  public process: ProcessModel;
  public errorResponse: HttpErrorResponse;

  private subscriptions = new Subscription();

  constructor(
    private activateRoute: ActivatedRoute,
    private entitiesTab: EntitiesTabService,
    private api: ApiService,
    public processAutosave: ProcessAutosaveService,
    private toast: ToastService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router
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
          // this.runAutoSave(res);
        }, (err: HttpErrorResponse) => {
          if (err.status === HttpStatusCodeEnum.FORBIDDEN) {
            this.handleForbiddenError(folderId, processId);
          } else {
            this.handleGeneralErrors(err, processId);
          }
        })
    );
  }

  private handleForbiddenError(folderId: string, processId: string): void {
    this.router.navigate(['/']).then(() => {
      this.dialog.open(ProcessAccessDeniedModalComponent, {
        width: '700px',
        autoFocus: false,
        data: {
          folderId,
          processId
        }
      });
    });
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

  private runAutoSave(process: ProcessModel): void {
    this.processAutosave.destroy();
    this.processAutosave.init(process);
  }

  public openGrantAccessModal(): void {
    this.dialog.open(GrantAccessModalComponent, {
      width: '700px',
      autoFocus: false,
      data: this.process
    });
  }

}
