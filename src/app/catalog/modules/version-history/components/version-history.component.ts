import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AnimationsHelper} from '../../../helpers/animations.helper';
import {ProcessVersionModel} from '../../../../models/domain/process-version.model';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from '../../../services/api/api.service';
import {HistoryTypeEnum} from '../models/history-type.enum';
import {SearchModel} from '../../../../models/domain/search.model';
import {HttpErrorResponse} from '@angular/common/http';
import {ProcessModel} from '../../../../models/domain/process.model';
import {KeycloakService} from 'keycloak-angular';
import {TranslateService} from '@ngx-translate/core';

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
  private currentDate: Date;

  @Input() set processData(value: ProcessModel) {
    this.process = value;
    if (this.panelState) {
      this.getHistory();
    }
  }

  @Output() versionOpened = new EventEmitter<ProcessVersionModel>();

  constructor(
    private api: ApiService,
    private kc: KeycloakService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.currentDate = new Date();
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
      this.getData(this.api.getVersions(this.process.parent?.id, this.process.id), (res: SearchModel<ProcessVersionModel>) => {
        this.versions = this.patchVersions(res?.items);
      });
    } else if (this.historyType === HistoryTypeEnum.START_AND_STOP_HISTORY) {
      this.getData(this.api.getStartAndStopHistory(), (res: SearchModel<ProcessVersionModel>) => {
        this.versions = this.patchVersions(res?.items);
      });
    }
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

  private patchVersions(versions: ProcessVersionModel[]): ProcessVersionModel[] {
    return versions?.find((v: ProcessVersionModel) => v.active)
      ? versions
      : [
        this.currentStaticVersion,
        ...versions
      ];
  }

  private get currentStaticVersion(): ProcessVersionModel {
    return {
      author: this.kc.getUsername(),
      createdAt: this.currentDate,
      description: '-',
      title: this.translate.instant('common.currentVersion'),
      versionID: '-',
      active: true,
      launched: true
    };
  }

  public versionCreated(version: ProcessVersionModel): void {
    if (this.versions?.length === 1) {
      this.getData(
        this.api.createNewVersion(this.process.parent.id, this.process.id), (res) => {
          console.log(res);
        });
    } else {
      this.getData(
        this.api.createBasedOnPreviousVersion(this.process.parent.id, this.process.id, version.versionID), (res) => {
          console.log(res);
        }
      );
    }
  }

}
