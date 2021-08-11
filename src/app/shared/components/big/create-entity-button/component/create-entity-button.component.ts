import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {MatDialog} from '@angular/material/dialog';
import {CreateEntityModalComponent} from '../../create-entity-modal/component/create-entity-modal.component';
import {ModalInjectableDataModel} from '../../../../../models/modal-injectable-data.model';
import {FolderModel} from '../../../../../models/domain/folder.model';

@Component({
  selector: 'np-create-entity-button',
  templateUrl: './create-entity-button.component.html',
  styleUrls: ['./create-entity-button.component.scss']
})
export class CreateEntityButtonComponent {
  @Input() parentFolder: FolderModel;

  @Output() entityCreated = new EventEmitter<void>();

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
        }
      } as ModalInjectableDataModel
    });
  }

}
