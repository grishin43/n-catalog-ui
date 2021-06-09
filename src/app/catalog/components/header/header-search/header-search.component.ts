import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {ContentHelper} from '../../../helpers/content.helper';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ActivatedRoute, Params, Router, RoutesRecognized} from '@angular/router';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {AppRouteEnum} from '../../../../models/app-route.enum';

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

  public formStretched: boolean;

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  @ViewChild('formRef') formRef;

  @HostListener('document:click', ['$event.target'])
  public onOutsideClick(targetElement): void {
    const clickedInside = this.formRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.formStretched = false;
    }
  }

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.formControlHandler();
    this.patchControlBySearchQuery();
  }

  private formControlHandler(): void {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        return this.filterEntities(value);
      })
    );
  }

  private patchControlBySearchQuery(): void {
    this.formControl.patchValue(this.activateRoute.snapshot.params[CatalogRouteEnum._QUERY]);
  }

  private filterEntities(value: string): CatalogEntityModel[] {
    return this.entities.filter((option: CatalogEntityModel) => {
      return option.name.toLowerCase().indexOf(value?.toLowerCase()) === 0;
    });
  }

  public onCrossClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.formControl.patchValue('');
    this.autocomplete.closePanel();
    this.formStretched = false;
  }

  public onOptionClicked(entity: CatalogEntityModel): void {
    if (entity.type === CatalogEntityEnum.FOLDER) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
    } else if (entity.type === CatalogEntityEnum.FILE) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${entity.id}`]);
    }
  }

  public onSubmit(): void {
    this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.SEARCH_RESULTS}/${this.formControl.value}`]);
  }

}
