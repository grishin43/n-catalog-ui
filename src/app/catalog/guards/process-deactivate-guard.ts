import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot} from '@angular/router';
import {ProcessComponent} from '../pages/process/process.component';
import {MatDialog} from '@angular/material/dialog';
import {PreventProcessCloseModalComponent} from '../../shared/components/big/prevent-process-close-modal/component/prevent-process-close-modal.component';
import {ProcessAutosaveService} from '../services/process-autosave/process-autosave.service';

@Injectable()
export class ProcessDeactivateGuard implements CanDeactivate<ProcessComponent> {

  constructor(
    private dialog: MatDialog,
    private processAutosave: ProcessAutosaveService,
    private router: Router
  ) {
  }

  canDeactivate(
    component: ProcessComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean {
    if (this.processAutosave.shouldSaved) {
      let str = nextState.url;
      str = str.substr(0, str.indexOf('?'));
      this.dialog.open(PreventProcessCloseModalComponent, {
        width: '700px',
        autoFocus: false,
        scrollStrategy: undefined
      }).afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.router.navigate(
            [str],
            {
              queryParams: nextState.root.queryParams
            }
          );
        }
      });
      return false;
    }
    return true;
  }

}
