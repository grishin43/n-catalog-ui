import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '../services/api/api.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ProcessModel} from '../../models/domain/process.model';
import {CatalogRouteEnum} from '../models/catalog-route.enum';
import {MatDialog} from '@angular/material/dialog';
import {ProcessAccessDeniedModalComponent} from '../../shared/components/big/process-access-denied-modal/component/process-access-denied-modal.component';
import {AppRouteEnum} from '../../models/app-route.enum';

@Injectable()
export class ProcessGuard implements CanActivate {

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const folderId = next.queryParams[CatalogRouteEnum._PARENT_ID];
    const processId = next.queryParams[CatalogRouteEnum._ID];
    return this.api
      .getProcessById(folderId, processId)
      .pipe(
        map((e: ProcessModel) => {
          if (e) {
            return true;
          }
        }),
        catchError(() => {
          this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${folderId}`]).then(() => {
            this.openAccessDeniedModal(folderId, processId);
          });
          return of(false);
        })
      );
  }

  private openAccessDeniedModal(folderId: string, processId: string): void {
    this.dialog.open(ProcessAccessDeniedModalComponent, {
      width: '700px',
      autoFocus: false,
      data: {
        folderId,
        processId
      }
    });
  }

}