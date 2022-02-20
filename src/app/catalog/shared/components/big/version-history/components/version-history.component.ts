import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AnimationsHelper} from '../../../../../helpers/animations.helper';
import {ProcessVersionModel} from '../../../../../../models/domain/process-version.model';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from '../../../../../services/api/api.service';
import {HistoryTypeEnum} from '../models/history-type.enum';
import {SearchModel} from '../../../../../../models/domain/search.model';
import {HttpErrorResponse} from '@angular/common/http';
import {CurrentProcessModel} from '../../../../../models/current-process.model';
import {UiNotificationCheck} from '../../../../../../models/domain/ui-notification.check';
import {ProcessService} from '../../../../../pages/folder/services/process/process.service';
import {Select} from '@ngxs/store';
import {CatalogSelectors} from '../../../../../store/selectors/catalog.selectors';
import {ProcessAutosaveService} from '../../../../../services/process-autosave/process-autosave.service';

@Component({
  selector: 'np-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class VersionHistoryComponent implements OnInit, OnDestroy {
  @Select(CatalogSelectors.currentProcessVersionId) versionId$: Observable<string>;

  public panelState: boolean;
  public historyType: HistoryTypeEnum = HistoryTypeEnum.VERSION_HISTORY;
  public eHistoryType = HistoryTypeEnum;
  public loader: boolean;
  public error: string;
  public versions: ProcessVersionModel[];
  public process: CurrentProcessModel;

  private refreshCounter = 0;
  private refreshLimit = 5;

  private subs = new Subscription();

  @Input() set processData(value: CurrentProcessModel) {
    this.process = value;
  }

  @Input() set processId(value: string) {
    if (value) {
      this.getHistory();
    }
  }

  @Input() set newVersionCreated(value: UiNotificationCheck) {
    if (value) {
      this.getHistory(true);
      this.closePanel();
    }
  }

  @Input() isLocked: boolean;

  @Output() versionOpenClicked = new EventEmitter<ProcessVersionModel>();
  @Output() createNewVersionClicked = new EventEmitter<void>();
  @Output() processRefreshRequested = new EventEmitter<void>();

  constructor(
    private api: ApiService,
    private processService: ProcessService,
    public processAutosave: ProcessAutosaveService
  ) {
  }

  ngOnInit(): void {
    this.subscribeVersionId();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private subscribeVersionId(): void {
    this.subs.add(
      this.versionId$.subscribe(() => this.closePanel())
    );
  }

  public showPanel(): void {
    this.panelState = true;
  }

  public hidePanel(): void {
    this.panelState = false;
  }

  public closePanel(): void {
    this.panelState = false;
    this.historyType = HistoryTypeEnum.VERSION_HISTORY;
  }

  public changeHistoryType(type: HistoryTypeEnum = HistoryTypeEnum.VERSION_HISTORY): void {
    this.historyType = type;
    this.getHistory();
  }

  private getHistory(checkCountAfter?: boolean): void {
    if (this.historyType === HistoryTypeEnum.VERSION_HISTORY) {
      this.getVersionsData(
        this.processService.getVersions(this.process.parent?.id, this.process.id),
        (res: SearchModel<ProcessVersionModel>) => this.versions = res?.items,
        checkCountAfter
      );
    } else if (this.historyType === HistoryTypeEnum.START_AND_STOP_HISTORY) {
      this.getVersionsData(
        this.api.getStartAndStopHistory(),
        (res: SearchModel<ProcessVersionModel>) => this.versions = res?.items,
        checkCountAfter
      );
    }
  }

  private getVersionsData(request: Observable<any>, cb: (res: any) => void, checkCountAfter?: boolean): void {
    this.loader = true;
    this.subs.add(
      request
        .subscribe((res: SearchModel<ProcessVersionModel>) => {
          if (checkCountAfter && res?.count === this.versions?.length && this.refreshCounter < this.refreshLimit) {
            this.refreshCounter++;
            this.processService.getProcessById(this.process.parent.id, this.process.id).toPromise()
              .then(() => this.getVersionsData(request, cb));
          } else {
            if (typeof cb === 'function') {
              cb(res);
            }
            this.loader = false;
          }
        }, (err: HttpErrorResponse) => {
          this.error = err.error?.message || err.message;
          this.loader = false;
        })
    );
  }

}
