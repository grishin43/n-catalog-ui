import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProcessVersionModel} from '../../../../../models/domain/process-version.model';
import {HistoryTypeEnum} from '../../models/history-type.enum';
import {ToastService} from '../../../../../shared/components/small/toast/service/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'np-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.scss']
})
export class VersionListComponent {
  @Input() versions: ProcessVersionModel[];
  @Input() type: HistoryTypeEnum;
  @Input() loader: boolean;
  @Input() error: string;
  @Input() isLocked: string;

  @Output() versionOpenClicked = new EventEmitter<ProcessVersionModel>();
  @Output() versionCreatClicked = new EventEmitter<ProcessVersionModel>();

  constructor(
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  public onVersionOpened(version: ProcessVersionModel): void {
    this.patchVersion(version, 'active', 'common.versionXxLaunched');
    this.versionOpenClicked.emit(version);
  }

  public onVersionLaunched(version: ProcessVersionModel): void {
    this.patchVersion(version, 'launched', 'common.versionXxLaunched');
  }

  public onVersionCreated(version: ProcessVersionModel): void {
    this.versionCreatClicked.emit(version);
  }

  private patchVersion(version: ProcessVersionModel, field: string, toastKey: string): void {
    this.versions?.forEach((v: ProcessVersionModel) => {
      if (v[field]) {
        v[field] = false;
      }
      if (v.versionID === version.versionID) {
        version[field] = true;
        this.toast.showMessage(
          this.translate.instant(
            toastKey,
            {versionName: version.title}
          ),
          5000
        );
      }
    });
  }

}
