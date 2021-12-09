import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {MatDialog} from '@angular/material/dialog';
import {CreateEntityModalComponent} from '../../create-entity-modal/component/create-entity-modal.component';
import {ModalInjectableEntityModel} from '../../../../../models/modal-injectable-entity.model';
import {FolderModel} from '../../../../../models/domain/folder.model';
import {RenameEntityModalComponent} from '../../rename-entity-modal/component/rename-entity-modal.component';

@Component({
  selector: 'np-folder-actions-button',
  templateUrl: './folder-actions-button.component.html',
  styleUrls: ['./folder-actions-button.component.scss']
})
export class FolderActionsButtonComponent {
  @Input() parentFolder: FolderModel;
  @Input() renameOnly: boolean;
  @Input() createPrefix: boolean;

  @Output() entityCreated = new EventEmitter<void>();
  @Output() entityRenamed = new EventEmitter<void>();

  public eCatalogEntity = CatalogEntityEnum;

  constructor(
    private dialog: MatDialog
  ) {
  }

  public createEntity(event: MouseEvent, type: CatalogEntityEnum): void {
    event.stopPropagation();
    event.preventDefault();
    this.dialog.open(CreateEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data: {
        parent: this.parentFolder,
        type,
        ssCb: () => {
          this.entityCreated.emit();
        },
        openCreatedInstance: true
      } as ModalInjectableEntityModel
    });
  }

  public renameEntity(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.dialog.open(RenameEntityModalComponent, {
      width: '700px',
      autoFocus: false,
      data: {
        entity: this.parentFolder,
        type: CatalogEntityEnum.FOLDER,
        ssCb: () => {
          this.entityRenamed.emit();
        }
      } as ModalInjectableEntityModel
    });
  }

}
