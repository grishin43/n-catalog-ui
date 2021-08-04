import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableColumnsModel} from '../../../shared/components/big/entities-table/models/table.model';
import {TableHelper} from '../../helpers/table.helper';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {ApiService} from '../../services/api/api.service';
import {FolderFieldKey, FolderModel} from '../../../models/domain/folder.model';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {MapHelper} from '../../helpers/map.helper';

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

  private folderId: string;
  private subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getFolderById(): void {
    this.loader = true;
    this.subscriptions.add(
      this.apiService.getFolderById(this.folderId).subscribe(
        (res: FolderModel) => {
          this.loader = false;
          this.handleResponse(res);
        }, () => {
          this.loader = true;
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

  public onEntityCreated(): void {
    setTimeout(() => {
      this.getFolderById();
    }, 200);
  }

}
