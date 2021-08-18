import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, interval, Subscription} from 'rxjs';
import {concatMap, tap, timeInterval} from 'rxjs/operators';
import {ApiService} from '../api/api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {BpmnModelerService} from '../bpmn-modeler/bpmn-modeler.service';
import {ConnectionService} from 'ng-connection-service';
import {HttpStatusCodeEnum} from '../../../models/http-status-code.enum';
import {ProcessModel} from '../../../models/domain/process.model';
import {ToastService} from '../toast/toast.service';
import {LocalStorageHelper} from '../../../helpers/localStorageHelper';
import {StorageEnum} from '../../../models/storageEnum';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ProcessAutosaveService {
  readonly delay = 60 * 10000;

  private timer$: Subscription;
  private networkState$: Subscription;
  private process: ProcessModel;

  public requestLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public resourceSaved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private bpmnModeler: BpmnModelerService,
    private connectionService: ConnectionService,
    private toast: ToastService
  ) {
  }

  public init(process: ProcessModel): void {
    this.process = process;
    this.listenNetwork();
    this.checkLocalResources();
    this.startTimer();
  }

  public destroy(): void {
    this.destroyNetworkListener();
    this.destroyTimer();
  }

  public handleServerErrors(): void {
    this.saveResourceLocal();
    this.showServerErrorToast();
  }

  public saveProcess(process: ProcessModel): Promise<void> {
    return this.bpmnModeler.getDiagramXml().then((content: string) => {
      this.api.saveResource(process, content)
        .subscribe(
          () => this.toast.show('common.diagramVersionSaved', 3000, 'OK'),
          () => this.handleServerErrors()
        );
    });
  }

  private showServerErrorToast(): void {
    this.bpmnModeler.showToast('common.directoryServerErrorTheChangesHaveBeenSaved', 3000, 'OK');
  }

  private destroyTimer(): void {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }

  private destroyNetworkListener(): void {
    if (this.networkState$) {
      this.networkState$.unsubscribe();
    }
  }

  private startTimer(): void {
    this.timer$ = interval(this.delay)
      .pipe(
        timeInterval(),
        tap(() => this.resourceSaved$.next(false)),
        tap(() => this.requestLoader$.next(true)),
        concatMap(() => this.saveProcess(this.process))
      )
      .subscribe(() => {
        this.requestLoader$.next(false);
        this.resourceSaved$.next(true);
        this.restartTimer();
      }, (err: HttpErrorResponse) => {
        this.requestLoader$.next(false);
        if (Object.values(HttpStatusCodeEnum).includes(err.status)) {
          this.handleServerErrors();
        }
        this.destroyTimer();
      });
  }

  private restartTimer(): void {
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

  private checkLocalResources(): void {
    const currentSavedProcesses: ProcessModel[] = LocalStorageHelper.getData(StorageEnum.SAVED_PROCESSES);
    if (currentSavedProcesses?.length) {
      forkJoin(
        currentSavedProcesses.map((p: ProcessModel) => this.api.saveResource(p, p.activeResource.content))
      ).subscribe(() => {
        LocalStorageHelper.deleteData(StorageEnum.SAVED_PROCESSES);
      }, () => {
        this.showServerErrorToast();
      });
    }
  }

  private saveResourceLocal(): void {
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
    });
  }

  private showNetworkConnectionToast(online: boolean): void {
    if (online) {
      this.bpmnModeler.showToast('common.internetConnectionRestored', 3000, 'OK');
    } else {
      this.bpmnModeler.showToast('common.noInternetConnectionTheChangesHaveBeenSaved', 3000);
    }
  }

}
