import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateEntityModalComponent} from '../../../../shared/components/big/create-entity-modal/component/create-entity-modal.component';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {InjectableDataModel} from '../../../../shared/components/big/create-entity-modal/models/injectable-data.model';

@Component({
  selector: 'np-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.scss']
})
export class CreateEntityComponent {
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
        type,
        ssCb: () => {
          this.entityCreated.emit();
        }
      } as InjectableDataModel
    });
  }

}
