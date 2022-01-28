import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {ProcessAutosaveService} from '../../services/process-autosave/process-autosave.service';
import {CurrentProcessModel} from '../../models/current-process.model';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpStatusCodeEnum} from '../../../models/http-status-code.enum';
import {TranslateService} from '@ngx-translate/core';
import {GrantAccessModalComponent} from '../../../shared/components/big/grant-access-modal/component/grant-access-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {BpmnModelerService} from '../../services/bpmn-modeler/bpmn-modeler.service';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {SaveVersionModalComponent} from '../../../shared/components/big/save-version-modal/component/save-version-modal.component';
import {ProcessVersionModel} from '../../../models/domain/process-version.model';
import {v4 as uuid} from 'uuid';
import {AnimationsHelper} from '../../helpers/animations.helper';
import {FormFieldEnum} from '../../../models/form-field.enum';
import {UiNotificationCheck} from '../../../models/domain/ui-notification.check';
import {ProcessService} from '../folder/services/process/process.service';
import {
  AskVersionSaveModalComponent
} from '../../../shared/components/big/ask-version-save-modal/components/ask-version-save-modal/ask-version-save-modal.component';
import {CatalogSelectors} from '../../store/selectors/catalog.selectors';
import {Select, Store} from '@ngxs/store';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {CatalogActions} from '../../store/actions/catalog.actions';
import {ToastService} from '../../../toast/service/toast.service';

@Component({
  selector: 'np-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class ProcessComponent implements OnInit, OnDestroy {
  @Select(CatalogSelectors.currentProcess) process$: Observable<CurrentProcessModel>;
  @Select(CatalogSelectors.currentProcessId) processId$: Observable<string>;
  @SelectSnapshot(CatalogSelectors.currentProcess) process: CurrentProcessModel;

  public errorResponse: HttpErrorResponse;
  public xmlMode: boolean;
  public modelerXml: string;
  public versionCreated: UiNotificationCheck;
  public httpStatusCode = HttpStatusCodeEnum;

  private subscriptions = new Subscription();

  constructor(
    public processAutosave: ProcessAutosaveService,
    public processService: ProcessService,
    private activateRoute: ActivatedRoute,
    private api: ApiService,
    private toast: ToastService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private bpmnModelerService: BpmnModelerService,
    private router: Router,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    document.body.classList.add('cdk-overflow');
    this.subscribeProcess();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cdk-overflow');
    this.subscriptions.unsubscribe();
    this.toast.close();
    this.processAutosave.destroy();
    this.store.dispatch(new CatalogActions.CurrentProcessClosed());
  }

  private subscribeProcess(): void {
    this.errorResponse = undefined;
    this.subscriptions.add(
      this.processId$
        .subscribe(() => {
          this.handleLockedBy();
        }, (err: HttpErrorResponse) => {
          this.handleGeneralErrors(err);
        })
    );
  }

  private subscribeVersion(versionId: string): void {
    this.errorResponse = undefined;
    this.processService.getProcessVersionById(this.process.parent.id, this.process.id, versionId).toPromise()
      .then(() => this.store.dispatch(new CatalogActions.ProcessVersionOpened(versionId)))
      .catch((err) => this.handleGeneralErrors(err));
  }

  private handleLockedBy(): void {
    if (this.process?.isLocked) {
      this.processAutosave.destroy();
      this.bpmnModelerService.showToast('common.someUserIsEditingProcess', undefined, 'OK');
    } else {
      this.processAutosave.init();
      this.processAutosave.checkLocalResources();
    }
  }

  private handleGeneralErrors(err: HttpErrorResponse): void {
    this.errorResponse = err;
  }

  public openGrantAccessModal(): void {
    this.dialog.open(GrantAccessModalComponent, {
      width: '700px',
      autoFocus: false,
      data: this.process
    });
  }

  public xmlDestroyed(xml: string): void {
    this.store.dispatch(new CatalogActions.ProcessActiveResourceXmlContentPatched(xml));
  }

  public changeModelerMode(flag: boolean): void {
    this.toggleXmlMode(flag);
    setTimeout(() => {
      this.bpmnModelerService.togglePaletteVisibility(flag);
    }, 0);
  }

  public onVersionOpened(version: ProcessVersionModel): void {
    if (this.processAutosave.shouldSaved) {
      this.openAskVersionSaveModal(version);
    } else {
      this.subscribeVersion(version.versionID);
    }
  }

  private openAskVersionSaveModal(version: ProcessVersionModel): void {
    const saveVersionResultSubscription = this.dialog.open(AskVersionSaveModalComponent, {
      width: '700px',
      autoFocus: false,
      data: version.title
    })
      .afterClosed()
      .subscribe(
        (res: boolean) => {
          if (res === true) {
            this.openCreateNewVersionModal();
          }
          if (res === false) {
            this.subscribeVersion(version.versionID);
          }
        });
    this.subscriptions.add(saveVersionResultSubscription);
  }

  public patchProcessActiveResource(): void {
    if (!this.process.activeResource) {
      this.bpmnModelerService.getDiagramXml().then((res: string) => {
        this.process = {
          ...this.process,
          activeResource: {
            content: res,
            id: uuid(),
            type: ResourceTypeEnum.XML
          }
        };
      });
    }
  }

  public openCreateNewVersionModal(): boolean {
    if (this.process?.isLocked || this.process?.blocked) {
      return false;
    }
    const shouldSaved = this.processAutosave.shouldSaved;
    this.processAutosave.disableSaving();
    const saveVersionResultSubscription = this.dialog.open(SaveVersionModalComponent, {
      width: '700px',
      autoFocus: false
    })
      .afterClosed()
      .subscribe(
        (formData: ({ [FormFieldEnum.NAME], [FormFieldEnum.DESCRIPTION] })) => {
          if (formData) {
            this.createNewVersion(formData[FormFieldEnum.NAME], formData[FormFieldEnum.DESCRIPTION]);
          } else if (shouldSaved) {
            this.processAutosave.enableSaving();
          }
        });
    this.subscriptions.add(saveVersionResultSubscription);
  }

  private toggleXmlMode(flag: boolean): void {
    if (!this.xmlMode) {
      this.bpmnModelerService.getDiagramXml().then((res: string) => {
        this.xmlMode = flag;
        this.modelerXml = res;
        if (!this.process.isLocked) {
          this.processAutosave.shouldSavedCheckout(res);
        }
      });
    } else {
      this.xmlMode = flag;
      if (!this.process.isLocked) {
        this.processAutosave.shouldSavedCheckout(this.modelerXml);
      }
    }
  }

  private createNewVersion(name: string, desc: string): void {
    this.bpmnModelerService.getDiagramXml().then((content: string) => {
      this.subscriptions.add(
        this.processService.createNewVersion(content, name, desc)
          .subscribe((res: UiNotificationCheck) => {
            this.versionCreated = res;
            const toastMessage = this.translate.instant('common.newProcessVersionCreated', {versionName: name});
            this.toast.showMessage(toastMessage);
          }, (err: HttpErrorResponse) => {
            this.handleGeneralErrors(err);
          })
      );
    });
  }

  public reloadPage(): void {
    window.location.reload();
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }

  public diagramWasChanged(flag: boolean): void {
    this.store.dispatch(new CatalogActions.ProcessDiscardChangesPatched(flag));
  }

}
