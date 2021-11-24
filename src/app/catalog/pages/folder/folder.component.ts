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
import {MatSnackBarRef} from '@angular/material/snack-bar/snack-bar-ref';
import {TextOnlySnackBar} from '@angular/material/snack-bar/simple-snack-bar';
import {Store} from '@ngxs/store';
import {CatalogSelectors} from '../../store/selectors/catalog.selectors';
import {FolderSelectors} from '../../store/folder/folder.selectors';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnDestroy {
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns();
  public folder: FolderModel;
  public folderEntities: CatalogEntityModel[] = [];
  // @select from store
  public folderChildren$: Observable<CatalogEntityModel[]>;
  public folder$: Observable<CatalogEntityModel>;
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
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.subscribeRouteParams();
    // this.apiService.getNotifications();
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
    this.folder$ = this.store.select(FolderSelectors.catalogEntityByFolderId(this.folderId));

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

  onDeleteEntity(entityToDelete: CatalogEntityModel): void {
    if (entityToDelete.type === CatalogEntityEnum.FOLDER) {
      this.deleteFolder(entityToDelete);
    } else if (entityToDelete.type === CatalogEntityEnum.PROCESS) {
      this.deleteProcess(entityToDelete);
    } else {
      throw new Error('Unknown entity to delete');
    }
  }

  private deleteFolder(folderToDelete: CatalogEntityModel): void {
    if (folderToDelete.hasProcesses || folderToDelete.hasSubFolders) {
      this.showCantDeleteFolderModal();
    } else {
      this.deleteFolderWithUndo(folderToDelete);
    }
  }

  private showCantDeleteFolderModal(): void {
    this.dialog.open(CantDeleteFolderModalComponent, {
      width: '700px',
      autoFocus: true
    });
  }

  private deleteFolderWithUndo(folderToDelete: CatalogEntityModel): void {
    let isDeleteWasUndo = false;
    // move to actions
    const undoFolderStructure = this.folderEntities;
    this.folderEntities = this.folderEntities
      .filter(({id}: CatalogEntityModel) => id !== folderToDelete.id);

    const deleteToast = this.createDeleteWithUndoToast(folderToDelete);

    deleteToast.onAction().subscribe(() => {
      isDeleteWasUndo = true;
      // move to actions
      this.folderEntities = undoFolderStructure;
    });

    deleteToast.afterDismissed().subscribe(() => {
      if (!isDeleteWasUndo) {
        this.folderService.deleteFolder(folderToDelete.id);
      }
    });
  }

  private createDeleteWithUndoToast(folderToDelete: CatalogEntityModel): MatSnackBarRef<TextOnlySnackBar> {
    const undoTranslation = this.translateService.instant('common.undo');
    return this.toastService.show(
      'common.entityDeleted',
      3000,
      undoTranslation,
      null,
      null,
      null,
      {entityName: folderToDelete.name}
    );
  }

  private deleteProcess(processToDelete: CatalogEntityModel): void {
    this.processService.deleteProcess(processToDelete.original.parentId, processToDelete.id).toPromise();
  }

}
