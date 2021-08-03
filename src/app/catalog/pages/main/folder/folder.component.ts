import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {AppRouteEnum} from '../../../../models/app-route.enum';
import {CreateEntityModalComponent} from '../../../../shared/components/big/create-entity-modal/component/create-entity-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {InjectableDataModel} from '../../../../shared/components/big/create-entity-modal/models/injectable-data.model';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {FolderModel} from '../../../../models/domain/folder.model';
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

  constructor(
    private dialog: MatDialog
  ) {
  }

  public get folderRoute(): string {
    return `/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${this.folder.id}`;
  }

  public createEntity(event: MouseEvent, type: CatalogEntityEnum): void {
    event.stopPropagation();
    event.preventDefault();
    this.dialog.open(CreateEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data: {
        parent: this.folder,
        type,
        ssCb: () => {
          this.entityCreated.emit();
        }
      } as InjectableDataModel
    });
  }

  public get folderI18nKey(): string {
    return TextHelper.declOfNum(this.folder.folders?.count || 0, ['foldersCount1', 'foldersCount2', 'foldersCount3']);
  }

  public get fileI18nKey(): string {
    return TextHelper.declOfNum(this.folder.definitions?.count || 0, ['filesCount1', 'filesCount2', 'filesCount3']);
  }

}
