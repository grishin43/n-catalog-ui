import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProcessVersionModel} from '../../../../../models/domain/process-version.model';
import {HistoryTypeEnum} from '../../models/history-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {Select} from '@ngxs/store';
import {CatalogSelectors} from '../../../../store/selectors/catalog.selectors';
import {Observable} from 'rxjs';
import {ToastService} from '../../../../../toast/service/toast.service';

@Component({
  selector: 'np-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.scss']
})
export class VersionListComponent {
  @Select(CatalogSelectors.currentProcessVersionId) currentVersionId$: Observable<string>;

  @Input() versions: ProcessVersionModel[];
  @Input() type: HistoryTypeEnum;
  @Input() loader: boolean;
  @Input() error: string;
  @Input() isLocked: boolean;
  @Input() autosaving: boolean;

  @Output() versionOpenClicked = new EventEmitter<ProcessVersionModel>();

  constructor(
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  public onVersionOpened(version: ProcessVersionModel): void {
    this.versionOpenClicked.emit(version);
  }

  public onVersionLaunched(version: ProcessVersionModel): void {
    this.patchVersion(version, 'launched', 'common.versionXxLaunched');
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
