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
import {BpmnModelerService} from '../../services/bpmn-modeler/bpmn-modeler.service';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {SaveVersionModalComponent} from '../../../shared/components/big/save-version-modal/component/save-version-modal.component';
import {CreateProcessVersionModel, ProcessVersionModel} from '../../../models/domain/process-version.model';
import {v4 as uuid} from 'uuid';
import {AnimationsHelper} from '../../helpers/animations.helper';
import {FormFieldEnum} from '../../../models/form-field.enum';
import {UiNotificationCheck} from '../../../models/domain/ui-notification.check';
import {ResourceModel} from '../../../models/domain/resource.model';
import {ProcessService} from '../folder/services/process/process.service';
import {AskVersionSaveModalComponent} from '../../../shared/components/big/ask-version-save-modal/components/ask-version-save-modal/ask-version-save-modal.component';

@Component({
  selector: 'np-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class ProcessComponent implements OnInit, OnDestroy {
  public process: ProcessModel;
  public errorResponse: HttpErrorResponse;
  public xmlMode: boolean;
  public modelerXml: string;
  public versionCreated: UiNotificationCheck;
  public loader: boolean;
  public httpStatusCode = HttpStatusCodeEnum;

  private subscriptions = new Subscription();

  constructor(
    public processAutosave: ProcessAutosaveService,
    private activateRoute: ActivatedRoute,
    private entitiesTab: EntitiesTabService,
    private api: ApiService,
    private toast: ToastService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private bpmnModelerService: BpmnModelerService,
    private processService: ProcessService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    document.body.classList.add('cdk-overflow');
    this.subscribeRoute();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cdk-overflow');
    this.subscriptions.unsubscribe();
    this.toast.close();
    this.processAutosave.destroy();
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
          this.handlePaletteVisibility();
          this.handleLockedBy();
        }, (err: HttpErrorResponse) => {
          this.handleGeneralErrors(err, processId);
        })
    );
  }

  private subscribeVersion(versionId: string): void {
    this.errorResponse = undefined;
    this.loader = true;
    this.subscriptions.add(
      this.api.getVersionById(this.process.parent.id, this.process.id, versionId)
        .subscribe((res: ProcessModel) => {
          this.process = res;
          this.loader = false;
        }, (err: HttpErrorResponse) => {
          this.handleGeneralErrors(err, this.process.id);
          this.loader = false;
        })
    );
  }

  private handleLockedBy(): void {
    if (this.process?.isLocked) {
      this.processAutosave.destroy();
      this.bpmnModelerService.showToast('common.someUserIsEditingProcess', undefined, 'OK');
    } else {
      this.processAutosave.init(this.process);
      this.processAutosave.checkLocalResources(this.process);
    }
  }

  private handlePaletteVisibility(): void {
    const paletteContainer = this.bpmnModelerService.modeler.get('palette')._container;
    if (this.process?.isLocked) {
      paletteContainer.classList.remove('show');
    } else {
      paletteContainer.classList.add('show');
    }
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
    if (this.process.activeResource) {
      this.process.activeResource.content = xml;
    } else {
      this.process.activeResource = {
        type: ResourceTypeEnum.XML,
        processId: this.process.id,
        content: xml
      };
    }
  }

  public changeModelerMode(flag: boolean): void {
    this.toggleXmlMode(flag);
    setTimeout(() => {
      this.handlePaletteVisibility();
    }, 0);
  }

  public onVersionOpened(version: ProcessVersionModel): void {
    if (this.processAutosave.shouldSaved) {
      this.subscribeVersion(version.versionID);
    } else {
      this.openAskVersionSaveModal(version);
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
    if (this.process?.isLocked) {
      return false;
    }
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
          }
        }, () => {
          this.processAutosave.enableSaving();
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

  private patchProcessResources(content: string): void {
    if (this.process.resources?.length && this.process.activeResource) {
      this.process.resources.forEach((pr: ResourceModel, index: number) => {
        if (pr.id === this.process.activeResource.id && pr.type === this.process.activeResource.type) {
          this.process.resources[index] = {
            ...this.process.activeResource,
            content
          };
        }
      });
    } else {
      this.process.resources = [{
        id: uuid(),
        processId: this.process.id,
        type: ResourceTypeEnum.XML,
        content
      }];
    }
  }

  private createNewVersion(name: string, desc: string): void {
    this.bpmnModelerService.getDiagramXml().then((content: string) => {
      this.patchProcessResources(content);
      const cpv: CreateProcessVersionModel = {
        versionTitle: name,
        versionDescription: desc,
        resources: this.process.resources || [],
        generation: this.process.generation
      };
      this.subscriptions.add(
        this.processService.createNewVersion(this.process.parent.id, this.process.id, cpv)
          .subscribe((res: UiNotificationCheck) => {
            this.versionCreated = res;
            const toastMessage = this.translate.instant('common.newProcessVersionCreated', {versionName: cpv.versionTitle});
            this.toast.showMessage(toastMessage);
            this.processAutosave.enableSaving();
            this.processAutosave.canDiscardChanges = false;
          }, (err: HttpErrorResponse) => {
            this.handleGeneralErrors(err, this.process.id);
            this.processAutosave.enableSaving();
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

}
