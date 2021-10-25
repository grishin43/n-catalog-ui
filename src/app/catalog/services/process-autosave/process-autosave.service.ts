import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, interval, Subscription} from 'rxjs';
import {concatMap, timeInterval} from 'rxjs/operators';
import {ApiService} from '../api/api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {BpmnModelerService} from '../bpmn-modeler/bpmn-modeler.service';
import {ConnectionService} from 'ng-connection-service';
import {ProcessModel} from '../../../models/domain/process.model';
import {ToastService} from '../../../shared/components/small/toast/service/toast.service';
import {LocalStorageHelper} from '../../../helpers/localStorageHelper';
import {StorageEnum} from '../../../models/storageEnum';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {WindowHelper} from '../../../helpers/window.helper';
import {HttpHelper} from '../../../helpers/http.helper';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';

@Injectable({
  providedIn: 'root'
})
export class ProcessAutosaveService {
  private delay = 60 * 1000;
  private timer$: Subscription;
  private networkState$: Subscription;

  public process: ProcessModel;
  public requestLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public resourceSaved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public shouldSaved: boolean;

  private subs = new Subscription();

  constructor(
    private api: ApiService,
    private bpmnModeler: BpmnModelerService,
    private connectionService: ConnectionService,
    private toast: ToastService,
    private activateRoute: ActivatedRoute
  ) {
    this.subs = this.activateRoute.queryParams
      .subscribe((queryParams: Params) => {
        const autosaveTime = queryParams[CatalogRouteEnum._AUTOSAVE_TIME];
        if (autosaveTime) {
          this.delay = autosaveTime;
        }
      });
  }

  public init(value: ProcessModel): void {
    this.process = value;
    this.listenNetwork();
  }

  public destroy(): void {
    this.destroyNetworkListener();
    this.disableSaving();
    this.subs.unsubscribe();
  }

  public disableSaving(): void {
    this.destroyTimer();
    WindowHelper.disableBeforeUnload();
    this.shouldSaved = false;
  }

  private handleServerErrors(): void {
    this.saveResourceLocal();
    this.showServerErrorToast();
  }

  public saveProcess(process: ProcessModel, ssCb?: () => void): Promise<void> {
    this.resourceSaved$.next(false);
    this.requestLoader$.next(true);
    return this.bpmnModeler.getDiagramXml().then((content: string) => {
      this.api.saveResource(process, content)
        .subscribe(
          () => {
            if (this.process.activeResource) {
              this.process.activeResource.content = content;
            } else {
              this.process.activeResource = {
                type: ResourceTypeEnum.XML,
                processId: this.process.id,
                content
              };
            }
            this.savingSuccessCb();
            this.toast.show('common.diagramVersionSaved', 3000, 'OK');
            if (typeof ssCb === 'function') {
              ssCb();
            }
          },
          () => {
            this.requestLoader$.next(false);
            this.handleServerErrors();
          }
        );
    });
  }

  private showServerErrorToast(): void {
    this.bpmnModeler.showToast('common.directoryServerErrorTheChangesHaveBeenSaved', 3000);
  }

  public destroyTimer(): void {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }

  private destroyNetworkListener(): void {
    if (this.networkState$) {
      this.networkState$.unsubscribe();
    }
  }

  public startTimer(): void {
    this.shouldSaved = true;
    this.timer$ = interval(this.delay)
      .pipe(
        timeInterval(),
        concatMap(() => this.saveProcess(this.process))
      )
      .subscribe(() => {
        this.destroyTimer();
      }, (err: HttpErrorResponse) => {
        if (HttpHelper.http5xxStatuses.includes(err.status)) {
          this.handleServerErrors();
        }
        this.destroyTimer();
      });
  }

  public restartTimer(): void {
    this.destroyTimer();
    this.startTimer();
  }

  private listenNetwork(): void {
    this.networkState$ = this.connectionService.monitor()
      .subscribe((res: boolean) => this.handleNetworkConnection(res));
  }

  private handleNetworkConnection(online: boolean): void {
    if (online) {
      this.checkLocalResources();
      this.restartTimer();
    } else {
      this.destroyTimer();
      this.saveResourceLocal();
    }
    this.showNetworkConnectionToast(online);
  }

  public checkLocalResources(): void {
    const currentSavedProcesses: ProcessModel[] = LocalStorageHelper.getData(StorageEnum.SAVED_PROCESSES);
    if (currentSavedProcesses?.length) {
      this.resourceSaved$.next(false);
      this.requestLoader$.next(true);
      forkJoin(
        currentSavedProcesses.map((p: ProcessModel) => this.api.saveResource(p, p.activeResource.content))
      ).subscribe(() => {
        LocalStorageHelper.deleteData(StorageEnum.SAVED_PROCESSES);
        this.savingSuccessCb();
        this.toast.show('common.diagramVersionSaved', 3000, 'OK');
      }, () => {
        this.requestLoader$.next(false);
        this.showServerErrorToast();
      });
    }
  }

  private saveResourceLocal(): void {
    this.resourceSaved$.next(false);
    this.requestLoader$.next(true);
    this.bpmnModeler.getDiagramXml().then((resource: string) => {
      const currentSavedProcesses: ProcessModel[] = LocalStorageHelper.getData(StorageEnum.SAVED_PROCESSES);
      const findIndex: number = currentSavedProcesses?.findIndex((p: ProcessModel) => {
        return p.id === this.process.id && p.parent.id === this.process.parent.id;
      });
      if (findIndex >= 0) {
        currentSavedProcesses.splice(findIndex, 1);
      }
      const newValue: ProcessModel[] = [{
        id: this.process.id,
        name: this.process.name,
        parent: this.process.parent,
        activeResource: {
          id: this.process.activeResource?.id,
          content: resource,
          type: ResourceTypeEnum.XML
        }
      } as ProcessModel, ...currentSavedProcesses || []];
      LocalStorageHelper.setData(StorageEnum.SAVED_PROCESSES, newValue);
      this.savingSuccessCb();
    }).catch((e) => {
      this.requestLoader$.next(false);
      console.error('Could save resource locally`\n', e);
    });
  }

  private savingSuccessCb(): void {
    this.requestLoader$.next(false);
    this.resourceSaved$.next(true);
    this.disableSaving();
  }

  private showNetworkConnectionToast(online: boolean): void {
    if (online) {
      this.bpmnModeler.showToast('common.internetConnectionRestored', 3000, 'OK');
    } else {
      this.bpmnModeler.showToast('common.noInternetConnectionTheChangesHaveBeenSaved', undefined);
    }
  }

  public shouldSavedCheckout(currentModelerXml: string): void {
    if (currentModelerXml !== this.process?.activeResource?.content) {
      this.shouldSaved = true;
    }
  }


  saveVersion(process: ProcessModel, versionName: string, description: string) {
    console.warn('mocked save of process version. Pending integration with BE', process, versionName, description);
  }
}
