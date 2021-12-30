import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
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
import {LocalSaverHelper} from '../../helpers/local-saver.helper';
import {CatalogActions} from '../../store/actions/catalog.actions';
import {Store} from '@ngxs/store';
import {ProcessService} from '../../pages/folder/services/process/process.service';

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
  public canDiscardChanges: boolean;

  private subs = new Subscription();

  constructor(
    private api: ApiService,
    private bpmnModeler: BpmnModelerService,
    private connectionService: ConnectionService,
    private toast: ToastService,
    private activateRoute: ActivatedRoute,
    private store: Store,
    private processService: ProcessService
  ) {
    this.subscribeRoute();
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

  public enableSaving(): void {
    this.startTimer();
    WindowHelper.enableBeforeUnload();
  }

  public saveProcess(process: ProcessModel, ssCb?: () => void): Promise<void> {
    this.resourceSaved$.next(false);
    this.requestLoader$.next(true);
    return this.bpmnModeler.getDiagramXml().then((content: string) => {
      this.processService.saveProcess(process, content)
        .subscribe(
          () => {
            this.savingSuccessCb();
            this.toast.show('common.diagramVersionSaved', 3000, 'OK');
            if (typeof ssCb === 'function') {
              ssCb();
            }
            // TODO: if has any version
            this.canDiscardChanges = true;
          },
          () => {
            this.requestLoader$.next(false);
            this.handleServerErrors();
          }
        );
    });
  }

  public destroyTimer(): void {
    if (this.timer$) {
      this.timer$.unsubscribe();
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

  public checkLocalResources(process: ProcessModel): void {
    const currentSavedProcesses: ProcessModel[] = LocalStorageHelper.getData(StorageEnum.SAVED_PROCESSES);
    const matchedSavedProcess: ProcessModel = currentSavedProcesses.find((p: ProcessModel) => p?.id === process?.id);
    if (matchedSavedProcess) {
      if (matchedSavedProcess.generation < process.generation) {
        LocalSaverHelper.deleteResource(matchedSavedProcess.parent.id, matchedSavedProcess.id);
      } else {
        this.resourceSaved$.next(false);
        this.requestLoader$.next(true);
        this.processService.saveProcess(matchedSavedProcess, matchedSavedProcess.activeResource.content)
          .subscribe(() => {
            LocalSaverHelper.deleteResource(matchedSavedProcess.parent.id, matchedSavedProcess.id);
            this.savingSuccessCb();
            this.toast.show('common.diagramVersionSaved', 3000, 'OK');
          }, () => {
            this.requestLoader$.next(false);
            this.showServerErrorToast();
          });
      }
    }
  }

  public shouldSavedCheckout(currentModelerXml: string): void {
    if (currentModelerXml !== this.process?.activeResource?.content) {
      this.shouldSaved = true;
    }
  }

  private listenNetwork(): void {
    this.networkState$ = this.connectionService.monitor()
      .subscribe((res: boolean) => this.handleNetworkConnection(res));
  }

  private showServerErrorToast(): void {
    this.bpmnModeler.showToast('common.directoryServerErrorTheChangesHaveBeenSaved', 3000);
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
      const newValue: ProcessModel[] = [this.getProcessNewValue(resource), ...currentSavedProcesses || []];
      LocalStorageHelper.setData(StorageEnum.SAVED_PROCESSES, newValue);
      this.savingSuccessCb();
    }).catch((e) => {
      this.requestLoader$.next(false);
      console.error('Could save resource locally`\n', e);
    });
  }

  private getProcessNewValue(resource: string): ProcessModel {
    return {
      id: this.process.id,
      name: this.process.name,
      parent: this.process.parent,
      generation: this.process.generation,
      activeResource: {
        id: this.process.activeResource?.id,
        content: resource,
        type: ResourceTypeEnum.XML
      }
    };
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

  private subscribeRoute(): void {
    this.subs = this.activateRoute.queryParams
      .subscribe((queryParams: Params) => {
        const autosaveTime = queryParams[CatalogRouteEnum._AUTOSAVE_TIME];
        if (autosaveTime) {
          this.delay = autosaveTime;
        }
      });
  }

  private handleNetworkConnection(online: boolean): void {
    if (online) {
      this.checkLocalResources(this.process);
      this.restartTimer();
    } else {
      this.destroyTimer();
      this.saveResourceLocal();
    }
    this.showNetworkConnectionToast(online);
  }

  private destroyNetworkListener(): void {
    if (this.networkState$) {
      this.networkState$.unsubscribe();
    }
  }

  private handleServerErrors(): void {
    this.saveResourceLocal();
    this.showServerErrorToast();
  }
}
