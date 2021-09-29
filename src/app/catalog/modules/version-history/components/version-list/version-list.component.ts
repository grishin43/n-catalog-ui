import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProcessVersionModel} from '../../../../../models/domain/process-version.model';
import {HistoryTypeEnum} from '../../models/history-type.enum';
import {ToastService} from '../../../../../shared/components/small/toast/service/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'np-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.scss']
})
export class VersionListComponent implements OnInit {
  @Input() versions: ProcessVersionModel[];
  @Input() type: HistoryTypeEnum;
  @Input() loader: boolean;
  @Input() error: string;

  @Output() versionOpened = new EventEmitter<ProcessVersionModel>();

  constructor(
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  public onVersionOpened(version: ProcessVersionModel): void {
    this.patchVersion(version, 'active', 'common.versionXxLaunched');
    this.versionOpened.emit(version);
  }

  public onVersionLaunched(version: ProcessVersionModel): void {
    this.patchVersion(version, 'launched', 'common.versionXxLaunched');
  }

  private patchVersion(version: ProcessVersionModel, field: string, toastKey: string): void {
    this.versions?.forEach((v: ProcessVersionModel) => {
      if (v[field]) {
        v[field] = false;
      }
      if (v.id === version.id) {
        version[field] = true;
        this.toast.showMessage(
          this.translate.instant(
            toastKey,
            {versionName: version.name}
          ),
          5000
        );
      }
    });
  }

}
