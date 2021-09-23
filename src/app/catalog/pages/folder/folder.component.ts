import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {ApiService} from '../../services/api/api.service';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {MapHelper} from '../../helpers/map.helper';
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

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnDestroy {
  public tableDisplayedColumns: TableColumnsModel[] = TableHelper.getEntitiesTableColumns();
  public folder: FolderModel;
  public folderEntities: CatalogEntityModel[] = [];
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
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getFolderById(): void {
    this.errorResponse = undefined;
    this.loader = true;
    this.subscriptions.add(
      this.apiService.getFolderByIdWithSubs(this.folderId).subscribe(
        (res: FolderModel) => {
          this.loader = false;
          this.handleResponse(res);
        }, (err: HttpErrorResponse) => {
          this.loader = false;
          this.errorResponse = err;
        }
      )
    );
  }

  private handleResponse(res: FolderModel): void {
    this.folder = res;
    this.folderEntities = [];
    if (res?.[FolderFieldKey.FOLDERS]?.count || res?.[FolderFieldKey.PROCESSES]?.count) {
      this.folderEntities.push(...MapHelper.mapFoldersToEntities(res[FolderFieldKey.FOLDERS]?.items));
      this.folderEntities.push(...MapHelper.mapProcessesToEntities(res[FolderFieldKey.PROCESSES]?.items));
    }
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
    const undoFolderStructure = this.folderEntities;
    this.folderEntities = this.folderEntities
      .filter(({id}: CatalogEntityModel) => id !== folderToDelete.id);

    const deleteToast = this.createDeleteWithUndoToast(folderToDelete);

    deleteToast.onAction().subscribe(() => {
      isDeleteWasUndo = true;
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
    this.processService.deleteProcess(processToDelete.original.parentId, processToDelete.id);
  }

}
