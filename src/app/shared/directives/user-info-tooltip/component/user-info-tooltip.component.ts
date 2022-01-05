import {Component, Input} from '@angular/core';
import {AnimationsHelper} from '../../../../catalog/helpers/animations.helper';
import {UserModel} from '../../../../models/domain/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'np-html-tooltip',
  templateUrl: './user-info-tooltip.component.html',
  styleUrls: ['./user-info-tooltip.component.scss'],
  animations: [AnimationsHelper.fadeInOut, AnimationsHelper.slide]
})
export class UserInfoTooltipComponent {
  @Input() user: UserModel;
  @Input() loader: boolean;
  @Input() error: HttpErrorResponse;

  public companiesCounter = 0;

  public get fullName(): string {
    if (this.user) {
      return `${this.user.lastName} ${this.user.firstName} ${this.user.middleName}`;
    }
    return null;
  }

  public openUserUrl(): void {
    window.open(this.user.url, '_blank').focus();
  }

  public get hasMultiplyCompanies(): boolean {
    return !!this.companiesCount;
  }

  public get companiesCount(): number {
    return this.user.companies?.length;
  }

  public get cantInc(): boolean {
    return this.companiesCounter === this.companiesCount - 1;
  }

  public get cantDec(): boolean {
    return !this.companiesCounter;
  }

  public changeCounter(event: MouseEvent, flag: boolean): void {
    event.preventDefault();
    event.stopPropagation();
    if (flag) {
      if (this.companiesCounter < this.companiesCount - 1) {
        this.companiesCounter++;
      }
    } else {
      if (this.companiesCounter >= 1) {
        this.companiesCounter--;
      }
    }
  }

}
