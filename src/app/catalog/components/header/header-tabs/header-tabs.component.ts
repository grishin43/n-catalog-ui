import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CurrentProcessModel} from '../../../models/current-process.model';
import {EntitiesTabService} from '../../../services/entities-tab/entities-tab.service';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';
import {
  PreventProcessCloseModalComponent
} from '../../../../shared/components/big/prevent-process-close-modal/component/prevent-process-close-modal.component';
import {AppRouteEnum} from '../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {ProcessAutosaveService} from '../../../services/process-autosave/process-autosave.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AnimationsHelper} from '../../../helpers/animations.helper';

@Component({
  selector: 'np-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class HeaderTabsComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private router: Router,
    private entitiesTabService: EntitiesTabService,
    private processAutosave: ProcessAutosaveService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
  }

  @Input() currentProcessId: string;
  @Input() currentProcessFolderId: string;
  @Input() showAllCrosses: boolean;
  @Input() searchFormStretched: BehaviorSubject<boolean>;
  @Input() isProcessPath: boolean;

  @Output() processOpened = new EventEmitter<boolean>();

  public catalogProcesses$: BehaviorSubject<CurrentProcessModel[]>;
  public rippleLightColor = MatRippleHelper.lightRippleColor;
  public readonly tabMinWidth = 125;
  public readonly menuBtnWidth = 56;
  public maxCount: number;

  private subs = new Subscription();

  @ViewChild('processesRow') rowRef: ElementRef;

  @HostListener('window:resize')
  onResize(): void {
    this.patchMaxCount();
  }

  ngOnInit(): void {
    this.setupCatalogEntities();
    this.listenSearchStretching();
  }

  ngAfterViewInit(): void {
    this.patchMaxCount();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private listenSearchStretching(): void {
    this.subs.add(
      this.searchFormStretched?.subscribe(() => {
        setTimeout(() => {
          this.patchMaxCount();
        }, 200);
      })
    );
  }

  private setupCatalogEntities(): void {
    this.catalogProcesses$ = this.entitiesTabService.processes;
  }

  public onDeleteClicked(event: MouseEvent, entity: CurrentProcessModel): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.currentProcessId === entity.id && this.processAutosave.shouldSaved) {
      this.subs.add(this.dialog.open(PreventProcessCloseModalComponent, {
          width: '700px',
          autoFocus: false
        }).afterClosed().subscribe((res: boolean) => {
          if (res) {
            this.entitiesTabService.deleteEntity(entity);
          }
        })
      );
    } else {
      this.entitiesTabService.deleteEntity(entity, this.currentProcessId !== entity.id);
    }
  }

  public openProcess(process: CurrentProcessModel): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
      {
        queryParams: {
          [CatalogRouteEnum._ID]: process.id,
          [CatalogRouteEnum._NAME]: process.name,
          [CatalogRouteEnum._PARENT_ID]: process.parent.id
        }
      }
    ).then(() => this.processOpened.emit(false));
  }

  public patchMaxCount(): void {
    if (this.rowRef?.nativeElement) {
      const row: HTMLElement = this.rowRef.nativeElement;
      const freeWidth = row.offsetWidth - this.menuBtnWidth;
      this.maxCount = Math.floor(freeWidth / this.tabMinWidth);
    }
  }

}
