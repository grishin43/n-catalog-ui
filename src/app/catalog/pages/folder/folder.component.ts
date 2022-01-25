import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {ApiService} from '../../services/api/api.service';
import {FolderModel} from '../../../models/domain/folder.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpStatusCodeEnum} from '../../../models/http-status-code.enum';
import {ToastService} from '../../../shared/components/small/toast/service/toast.service';
import {CatalogEntityEnum} from '../../models/catalog-entity.enum';
import {TranslateService} from '@ngx-translate/core';
import {FolderService} from './services/folder/folder.service';
import {ProcessService} from './services/process/process.service';
import {MatDialog} from '@angular/material/dialog';
import {CantDeleteFolderModalComponent} from './components/cant-delete-folder-modal/cant-delete-folder-modal.component';
import {Store} from '@ngxs/store';
import {CatalogSelectors} from '../../store/selectors/catalog.selectors';
import {FolderSelectors} from '../../store/folder/folder.selectors';
import {FolderActions} from '../../store/folder/folder.actions';
import {ProcessActions} from '../../store/process/process.actions';
import {EntitiesTabService} from '../../services/entities-tab/entities-tab.service';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnDestroy {
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns();
  // @select from store
  public folderChildren$: Observable<CatalogEntityModel[]>;
  public folderEntity$: Observable<CatalogEntityModel>;
  public folder$: Observable<FolderModel>;
  public loader: boolean;
  public errorResponse: HttpErrorResponse;
  public httpStatusCode = HttpStatusCodeEnum;

  private folderId: string;
  private subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService,
    private folderService: FolderService,
    private processService: ProcessService,
    private dialog: MatDialog,
    private store: Store,
    private entitiesTab: EntitiesTabService
  ) {
  }

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getFolderById(): void {
    this.getFolderDetails();
  }

  public async getFolderDetails(): Promise<void> {
    this.errorResponse = undefined;
    this.loader = true;
    this.folderChildren$ = this.store.select(CatalogSelectors.folderChildren(this.folderId));
    this.folderEntity$ = this.store.select(FolderSelectors.catalogEntityByFolderId(this.folderId));
    this.folder$ = this.store.select(FolderSelectors.folderById(this.folderId));
    try {
      await this.folderService.fetchFolderDetails(this.folderId);
    } catch (err) {
      this.errorResponse = err;
    }
    this.loader = false;
  }

  private subscribeRouteParams(): void {
    this.subscriptions.add(
      this.activatedRoute.params
        .subscribe((params: Params) => {
          this.folderId = params[CatalogRouteEnum._ID];
          this.getFolderById();
        })
    );
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }

  public onDeleteEntity(entityToDelete: CatalogEntityModel): void {
    if (entityToDelete.type === CatalogEntityEnum.FOLDER) {
      this.deleteFolder(entityToDelete);
    } else if (entityToDelete.type === CatalogEntityEnum.PROCESS) {
      this.deleteEntityWithUndo(entityToDelete);
    } else {
      throw new Error('Unknown entity to delete');
    }
  }

  private deleteFolder(folderToDelete: CatalogEntityModel): void {
    if (folderToDelete.hasProcesses || folderToDelete.hasSubFolders) {
      this.showCantDeleteFolderModal();
    } else {
      this.deleteEntityWithUndo(folderToDelete);
    }
  }

  private showCantDeleteFolderModal(): void {
    this.dialog.open(CantDeleteFolderModalComponent, {
      width: '700px',
      autoFocus: true
    });
  }

  private deleteEntityWithUndo(entity: CatalogEntityModel): void {
    let isDeleteWasUndo = false;
    const deleteToast = this.toastService.showWithUndo('common.entityDeleted', {entityName: entity.name});
    if (entity.type === CatalogEntityEnum.FOLDER) {
      this.store.dispatch(new FolderActions.FolderMarkedToBeDeleted(entity.id));
    } else if (entity.type === CatalogEntityEnum.PROCESS) {
      this.store.dispatch(new ProcessActions.ProcessMarkedToBeDeleted(entity.id));
      this.entitiesTab.deleteEntity({id: entity.id}, true);
    }
    deleteToast.onAction().subscribe(() => {
      isDeleteWasUndo = true;
      if (entity.type === CatalogEntityEnum.FOLDER) {
        this.store.dispatch(new FolderActions.FolderRevertToBeDeleted(entity.id));
      } else if (entity.type === CatalogEntityEnum.PROCESS) {
        this.store.dispatch(new ProcessActions.ProcessRevertToBeDeleted(entity.id));
      }
    });
    deleteToast.afterDismissed().subscribe(() => {
      if (!isDeleteWasUndo) {
        if (entity.type === CatalogEntityEnum.FOLDER) {
          this.folderService.deleteFolder(entity.id);
        } else if (entity.type === CatalogEntityEnum.PROCESS) {
          this.processService.deleteProcess(entity.original.parentId, entity.id);
        }
      }
    });
  }

}
