import {Component, Input} from '@angular/core';
import {AnimationsHelper} from '../../../../helpers/animations.helper';
import {WorkgroupUserModel} from '../../../../../models/domain/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'np-html-tooltip',
  templateUrl: './user-info-tooltip.component.html',
  styleUrls: ['./user-info-tooltip.component.scss'],
  animations: [AnimationsHelper.fadeInOut, AnimationsHelper.slide]
})
export class UserInfoTooltipComponent {
  public loading: boolean;
  public error: HttpErrorResponse;
  public workplacesCounter = 0;
  public user: WorkgroupUserModel;

  constructor() {
  }

  public openUserUrl(): void {
    window.open(this.user?.profile, '_blank').focus();
  }

  public get hasMultiplyWorkplaces(): boolean {
    return this.workplacesCount > 1;
  }

  public get hasWorkspaces(): boolean {
    return !!this.workplacesCount;
  }

  public get workplacesCount(): number {
    return this.user?.workplaces?.length;
  }

  public get cantInc(): boolean {
    return this.workplacesCounter === this.workplacesCount - 1;
  }

  public get cantDec(): boolean {
    return !this.workplacesCounter;
  }

  public changeCounter(event: MouseEvent, flag: boolean): void {
    event.preventDefault();
    event.stopPropagation();
    if (flag) {
      if (this.workplacesCounter < this.workplacesCount - 1) {
        this.workplacesCounter++;
      }
    } else {
      if (this.workplacesCounter >= 1) {
        this.workplacesCounter--;
      }
    }
  }

}
