import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {ContentHelper} from '../../../helpers/content.helper';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';

@Component({
  selector: 'np-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit {
  public formControl = new FormControl();
  public entities: CatalogEntityModel[] = ContentHelper.getCatalogEntities(5, false);
  public filteredOptions: Observable<CatalogEntityModel[]>;
  public catalogEntityType = CatalogEntityEnum;

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  ngOnInit(): void {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        return this.filterEntities(value);
      })
    );
  }

  private filterEntities(value: string): CatalogEntityModel[] {
    return this.entities.filter((option: CatalogEntityModel) => {
      return option.name.toLowerCase().indexOf(value.toLowerCase()) === 0;
    });
  }

  public onCrossClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.formControl.patchValue('');
    this.autocomplete.closePanel();
  }

}
