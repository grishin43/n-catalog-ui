import {Component, Input} from '@angular/core';
import {EmployeeModel} from '../../../../../models/employee.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'np-persons',
  templateUrl: './np-persons.component.html',
  styleUrls: ['./np-persons.component.scss']
})
export class NpPersonsComponent {
  @Input() persons: EmployeeModel[];
  @Input() active: EmployeeModel;
  @Input() limit = 3;
  @Input() entityOwner: EmployeeModel;

  constructor(
    private translate: TranslateService
  ) {
  }

  public get tooltipMessage(): string {
    let str = '';
    if (this.persons) {
      this.persons.forEach((item: EmployeeModel, index: number) => {
        str += `${item.lastName} ${item.firstName}`;
        if (item.id === this.entityOwner.id) {
          str += `(${this.translate.instant('common.owner').toLowerCase()})`;
        }
        if (item.id === this.active?.id) {
          str += `(${this.translate.instant('common.editing').toLowerCase()})`;
        }
        if (index !== this.persons.length - 1) {
          str += ', ';
        }
      });
    }
    return str;
  }
}
