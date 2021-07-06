import {Component, Input} from '@angular/core';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';

@Component({
  selector: 'np-folder-breadcrumbs',
  templateUrl: './folder-breadcrumbs.component.html',
  styleUrls: ['./folder-breadcrumbs.component.scss']
})
export class FolderBreadcrumbsComponent {
  @Input() folder: CatalogEntityModel;

  public rippleLightColor = MatRippleHelper.lightRippleColor;

  public onCreateFolderClicked(event: MouseEvent): void {
    // TODO
  }

  public onCreateFileClicked(event: MouseEvent): void {
    // TODO
  }

}
