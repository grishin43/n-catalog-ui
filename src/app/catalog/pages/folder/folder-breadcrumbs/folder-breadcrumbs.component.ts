import {Component, Input} from '@angular/core';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';
import {MatDialog} from '@angular/material/dialog';
import {CreateEntityModalComponent} from '../../../../shared/components/big/create-entity-modal/component/create-entity-modal.component';
import {InjectableDataModel} from '../../../../shared/components/big/create-entity-modal/models/injectable-data.model';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {FolderModel} from '../../../../models/domain/folder.model';

@Component({
  selector: 'np-folder-breadcrumbs',
  templateUrl: './folder-breadcrumbs.component.html',
  styleUrls: ['./folder-breadcrumbs.component.scss']
})
export class FolderBreadcrumbsComponent {
  @Input() folder: FolderModel;

  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public eCatalogEntity = CatalogEntityEnum;

  constructor(
    private dialog: MatDialog
  ) {
  }

  public onCreateEntity(event: MouseEvent, type: CatalogEntityEnum): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(CreateEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data: {
        parent: this.folder,
        type
      } as InjectableDataModel
    });
  }

}
