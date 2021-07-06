import {Component, HostListener, EventEmitter, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {AppRouteEnum} from '../../../../models/app-route.enum';
import {SearchService} from '../../../services/search/search.service';
import loader from '@angular-devkit/build-angular/src/webpack/plugins/single-test-transform';

@Component({
  selector: 'np-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  public formControl = new FormControl();
  public entities: CatalogEntityModel[];
  public filteredOptions: Observable<CatalogEntityModel[]>;
  public catalogEntityType = CatalogEntityEnum;
  public formStretched: boolean;
  public loader: boolean;

  private subscription = new Subscription();

  @Output() formHasStretched = new EventEmitter<boolean>();

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  @ViewChild('formRef') formRef;

  @HostListener('document:click', ['$event.target'])
  public onOutsideClick(targetElement): void {
    const clickedInside = this.formRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.formStretched = false;
      if (!this.formControl.value?.length) {
        this.formHasStretched.emit(false);
      }
    }
  }

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.entities = this.searchService.getSavedEntities();
    this.formControlHandler();
    this.patchControlBySearchQuery();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    if (location.pathname.indexOf(`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.SEARCH_RESULTS}/`) !== -1) {
      const query = location.pathname.split('/').pop();
      if (query?.trim().length) {
        this.formControl.patchValue(query);
        this.submit();
      }
    }
  }

  private filterEntities(value: string): CatalogEntityModel[] {
    return this.entities?.filter((option: CatalogEntityModel) => {
      return option.name.toLowerCase().indexOf(value?.toLowerCase()) === 0;
    });
  }

  public onCrossClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.formControl.patchValue('');
    this.autocomplete.closePanel();
    this.formStretched = false;
    this.formHasStretched.emit(false);
  }

  public onOptionClicked(entity: CatalogEntityModel): void {
    if (entity.type === CatalogEntityEnum.FOLDER) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
    } else if (entity.type === CatalogEntityEnum.FILE) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}/${entity.id}`]);
    }
  }

  public submit(): void {
    if (this.formControl.value?.trim().length) {
      this.toggleFormState(true);
      this.searchService.searchEntities(this.formControl.value)
        .subscribe(
          () => {
            this.toggleFormState(false);
            this.entities = this.searchService.getSavedEntities();
          },
          () => this.toggleFormState(false));
    }
  }

  private toggleFormState(flag: boolean): void {
    this.loader = flag;
    flag ? this.formControl.disable() : this.formControl.enable();
  }

}
