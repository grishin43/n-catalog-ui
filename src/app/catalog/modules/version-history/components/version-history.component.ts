import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AnimationsHelper} from '../../../helpers/animations.helper';
import {ProcessVersionModel} from '../../../../models/domain/process-version.model';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from '../../../services/api/api.service';
import {HistoryTypeEnum} from '../models/history-type.enum';
import {SearchModel} from '../../../../models/domain/search.model';
import {HttpErrorResponse} from '@angular/common/http';
import {ProcessModel} from '../../../../models/domain/process.model';
import {UiNotificationCheck} from '../../../../models/domain/ui-notification.check';

@Component({
  selector: 'np-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class VersionHistoryComponent implements OnInit, OnDestroy {
  public panelState: boolean;
  public historyType: HistoryTypeEnum = HistoryTypeEnum.VERSION_HISTORY;
  public eHistoryType = HistoryTypeEnum;
  public loader: boolean;
  public error: string;
  public versions: ProcessVersionModel[];
  public process: ProcessModel;

  private subs = new Subscription();

  @Input() set processData(value: ProcessModel) {
    this.process = value;
    if (value) {
      this.getHistory();
    }
  }

  @Input() set newVersionCreated(value: UiNotificationCheck) {
    if (value) {
      this.getHistory();
    }
  }

  @Output() versionOpenClicked = new EventEmitter<ProcessVersionModel>();
  @Output() createNewVersionClicked = new EventEmitter<void>();
  @Output() versionsAvailabilityChanged = new EventEmitter<boolean>();

  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  private getHistory(): void {
    if (this.historyType === HistoryTypeEnum.VERSION_HISTORY) {
      this.getData(
        this.api.getVersions(this.process.parent?.id, this.process.id),
        (res: SearchModel<ProcessVersionModel>) => this.getHistoryCb(res)
      );
    } else if (this.historyType === HistoryTypeEnum.START_AND_STOP_HISTORY) {
      this.getData(
        this.api.getStartAndStopHistory(),
        (res: SearchModel<ProcessVersionModel>) => this.getHistoryCb(res)
      );
    }
  }

  private getHistoryCb(res: SearchModel<ProcessVersionModel>): void {
    this.versions = res?.items;
    this.versionsAvailabilityChanged.emit(!!res?.count);
  }

  private getData(request: Observable<any>, cb: (res: any) => void): void {
    this.loader = true;
    this.subs.add(
      request
        .subscribe((res: any) => {
          this.loader = false;
          if (typeof cb === 'function') {
            cb(res);
          }
        }, (err: HttpErrorResponse) => {
          this.error = err.error?.message || err.message;
          this.loader = false;
        })
    );
  }

  public createVersion(version: ProcessVersionModel): void {
    this.getData(
      this.api.createBasedOnPreviousVersion(this.process.parent.id, this.process.id, version.versionID), (res) => {
        this.getHistory();
        console.log(res);
      }
    );
  }

}
