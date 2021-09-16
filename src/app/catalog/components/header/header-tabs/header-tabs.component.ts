import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ProcessModel} from '../../../../models/domain/process.model';
import {EntitiesTabService} from '../../../services/entities-tab/entities-tab.service';
import {MatRippleHelper} from '../../../helpers/mat-ripple.helper';
import {PreventProcessCloseModalComponent} from '../../../../shared/components/big/prevent-process-close-modal/component/prevent-process-close-modal.component';
import {AppRouteEnum} from '../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../models/catalog-route.enum';
import {ProcessAutosaveService} from '../../../services/process-autosave/process-autosave.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'np-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.scss']
})
export class HeaderTabsComponent implements OnInit, OnDestroy {
  @Input() processId: string;
  @Input() folderId: string;
  @Input() showAllCrosses: boolean;

  public catalogProcesses$: BehaviorSubject<ProcessModel[]>;
  public rippleLightColor = MatRippleHelper.lightRippleColor;

  private subs = new Subscription();

  constructor(
    private router: Router,
    private entitiesTabService: EntitiesTabService,
    private processAutosave: ProcessAutosaveService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.setupCatalogEntities();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private setupCatalogEntities(): void {
    this.catalogProcesses$ = this.entitiesTabService.processes;
  }

  public onDeleteClicked(event: MouseEvent, entity: ProcessModel): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.processAutosave.shouldSaved) {
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
      this.entitiesTabService.deleteEntity(entity);
    }
  }

  public openProcess(process: ProcessModel): void {
    this.router.navigate(
      [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.PROCESS}`],
      {
        queryParams: {
          [CatalogRouteEnum._ID]: process.id,
          [CatalogRouteEnum._NAME]: process.name,
          [CatalogRouteEnum._PARENT_ID]: process.parent.id
        }
      }
    );
  }

}
