import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AnimationsHelper} from '../../../helpers/animations.helper';
import {ProcessVersionModel} from '../../../../models/domain/process-version.model';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from '../../../services/api/api.service';
import {HistoryTypeEnum} from '../models/history-type.enum';
import {SearchModel} from '../../../../models/domain/search.model';
import {HttpErrorResponse} from '@angular/common/http';

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

  private subs = new Subscription();

  @Output() versionOpened = new EventEmitter<ProcessVersionModel>();

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
    this.getHistory();
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
      this.getData(this.api.getVersionHistory());
    } else if (this.historyType === HistoryTypeEnum.START_AND_STOP_HISTORY) {
      this.getData(this.api.getStartAndStopHistory());
    }
  }

  private getData(request: Observable<SearchModel<ProcessVersionModel>>): void {
    this.loader = true;
    this.subs.add(
      request
        .subscribe((res: SearchModel<ProcessVersionModel>) => {
          this.loader = false;
          this.versions = res?.items;
        }, (err: HttpErrorResponse) => {
          this.error = err.error?.message || err.message;
          this.loader = false;
        })
    );
  }

}
