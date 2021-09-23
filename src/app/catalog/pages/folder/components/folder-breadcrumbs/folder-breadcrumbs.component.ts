import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatRippleHelper} from '../../../../helpers/mat-ripple.helper';
import {CatalogEntityEnum} from '../../../../models/catalog-entity.enum';
import {FolderModel} from '../../../../../models/domain/folder.model';
import {AppRouteEnum} from '../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../models/catalog-route.enum';

@Component({
  selector: 'np-folder-breadcrumbs',
  templateUrl: './folder-breadcrumbs.component.html',
  styleUrls: ['./folder-breadcrumbs.component.scss']
})
export class FolderBreadcrumbsComponent {
  @Input() folder: FolderModel;

  @Output() folderUpdated = new EventEmitter<void>();

  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public eCatalogEntity = CatalogEntityEnum;
  public folderRoute = `/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/`;

  public folderRenamed(): void {
    this.folderUpdated.emit();
  }

}
