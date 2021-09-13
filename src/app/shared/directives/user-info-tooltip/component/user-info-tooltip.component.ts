import {Component, Input} from '@angular/core';
import {AnimationsHelper} from '../../../../catalog/helpers/animations.helper';
import {UserModel} from '../../../../models/domain/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'np-html-tooltip',
  templateUrl: './user-info-tooltip.component.html',
  styleUrls: ['./user-info-tooltip.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class UserInfoTooltipComponent {
  @Input() user: UserModel;
  @Input() loader: boolean;
  @Input() error: HttpErrorResponse;

  public get fullName(): string {
    if (this.user) {
      return `${this.user.lastName} ${this.user.firstName} ${this.user.middleName}`;
    }
    return null;
  }

  public openUserUrl(): void {
    if (this.user?.url) {
      window.open(this.user.url, '_blank').focus();
    }
  }

}
