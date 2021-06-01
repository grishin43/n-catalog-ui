import {Component, Input} from '@angular/core';
import {CatalogFolderModel} from '../../../models/folder.model';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {AppRouteEnum} from '../../../../models/app-route.enum';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  @Input() folder: CatalogFolderModel;

  public rippleLightColor = MatRippleHelper.lightRippleColor;

  public get folderRoute(): string {
    return `/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${this.folder.id}`;
  }

  public onCreateFolderClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  public onCreateFileClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

}
