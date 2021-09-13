import {Component, HostListener, EventEmitter, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../models/catalog-entity.enum';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {AppRouteEnum} from '../../../../models/app-route.enum';
import {SearchService} from '../../../services/search/search.service';
import {ContentHelper} from '../../../helpers/content.helper';
import {SearchAutocompleteDto} from '../../../services/search/searchAutocomplete.dto';

@Component({
  selector: 'np-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  public formControl = new FormControl();
  public entities: CatalogEntityModel[];
  public filteredOptions: CatalogEntityModel[];
  public autoCompleteResults: SearchAutocompleteDto;
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
      document.body.classList.remove('search-form-stretched');
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
    this.entities = this.searchService.savedEntities;
    this.showPreviousSearchResults();
    this.patchControlBySearchQuery();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private patchControlBySearchQuery(): void {
    if (location.pathname.indexOf(`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.SEARCH_RESULTS}/`) !== -1) {
      const query = location.pathname.split('/').pop();
      if (query?.trim().length) {
        this.formControl.patchValue(query);
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
    this.searchService.saveEntities([entity]);
    this.entities = this.searchService.savedEntities;
    if (entity.type === CatalogEntityEnum.FOLDER) {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${entity.id}`]);
    } else if (entity.type === CatalogEntityEnum.PROCESS) {
      this.router.navigate(
        [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
        {
          queryParams: {
            [CatalogRouteEnum._ID]: entity.id,
            [CatalogRouteEnum._NAME]: entity.name
          }
        }
      );
    }
  }

  public submit(): void {
    if (this.formControl.value?.trim().length) {
      this.toggleFormState(true);
      this.searchEntities(
        () => {
          this.toggleFormState(false);
          this.entities = this.searchService.savedEntities;
        },
        () => this.toggleFormState(false));
    }
  }

  private searchEntities(sucCb?: () => void, errCb?: () => void): void {
    this.subscription.add(
      this.searchService.searchEntities(this.formControl.value)
        .subscribe(
          () => {
            if (typeof sucCb === 'function') {
              sucCb();
            }
          },
          () => {
            if (typeof errCb === 'function') {
              errCb();
            }
          }
        )
    );
  }

  private toggleFormState(flag: boolean): void {
    this.loader = flag;
    flag ? this.formControl.disable() : this.formControl.enable();
  }

  public get panelWidth(): number {
    if (window.innerWidth > 1440) {
      return 500;
    } else if (window.innerWidth <= 1440 && window.innerWidth > 1200) {
      return 350;
    } else if (window.innerWidth <= 1200 && window.innerWidth > 960) {
      return 250;
    } else if (window.innerWidth <= 960) {
      return 200;
    }
  }

  public onFormClicked(): void {
    document.body.classList.add('search-form-stretched');
    this.formStretched = true;
    this.formHasStretched.emit(true);
  }

  public typeAHeadSearch(query: string): void {
    if (query.trim() === '') {
      this.showPreviousSearchResults();
    } else {
      this.showSearchOptions(query);
    }
  }

  private showSearchOptions(query: string): void {
    this.searchService.fetchAutocompleteSearchResults(query).subscribe(
      (result) => {
      this.autoCompleteResults = result;
    }, (error) => {
        console.error('[HeaderSearch] autocomplete search error', error);
      })
    this.filteredOptions = ContentHelper.testEntities
      .filter((option: CatalogEntityModel) => {
        return option.name.toLowerCase().indexOf(query?.toLowerCase()) === 0;
      });
  }

  private showPreviousSearchResults(): void {
    this.filteredOptions = [];
    this.searchService.recentSearch$().subscribe((recentSearch) => {
      console.log('[HeaderSearch] recent search ', recentSearch);
      this.filteredOptions = recentSearch;
    })
  }

}
