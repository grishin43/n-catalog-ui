import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {AppRouteEnum} from '../../../../models/app-route.enum';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {FolderFieldKey, FolderModel} from '../../../../models/domain/folder.model';
import {TextHelper} from '../../../helpers/text.helper';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  @Input() folder: FolderModel;

  @Output() entityCreated = new EventEmitter<void>();

  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public eCatalogEntity = CatalogEntityEnum;
  public eFolderFieldKey = FolderFieldKey;

  public get folderRoute(): string {
    return `/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${this.folder.id}`;
  }

  public get folderI18nKey(): string {
    return TextHelper.declOfNum(
      this.folder[FolderFieldKey.FOLDERS]?.count || 0,
      ['foldersCount1', 'foldersCount2', 'foldersCount3']
    );
  }

  public get processI18nKey(): string {
    return TextHelper.declOfNum(
      this.folder[FolderFieldKey.PROCESSES]?.count || 0,
      ['processesCount1', 'processesCount2', 'processesCount3']
    );
  }

}
