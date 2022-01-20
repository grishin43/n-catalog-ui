import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CurrentProcessModel} from '../models/current-process.model';
import {CatalogRouteEnum} from '../models/catalog-route.enum';
import {MatDialog} from '@angular/material/dialog';
import {ProcessAccessDeniedModalComponent} from '../../shared/components/big/process-access-denied-modal/component/process-access-denied-modal.component';
import {AppRouteEnum} from '../../models/app-route.enum';
import {ProcessService} from '../pages/folder/services/process/process.service';

@Injectable()
export class ProcessActivateGuard implements CanActivate {

  constructor(
    private processService: ProcessService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const folderId = next.queryParams[CatalogRouteEnum._PARENT_ID];
    const processId = next.queryParams[CatalogRouteEnum._ID];
    return this.processService
      .getProcessById(folderId, processId)
      .pipe(
        map((e: CurrentProcessModel) => {
          if (e) {
            return true;
          }
        }),
        catchError((e) => {
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
