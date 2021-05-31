import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NpStatusPillEnum} from '../models/np-status-pill.enum';

@Component({
  selector: 'np-status-pill',
  templateUrl: './np-status-pill.component.html',
  styleUrls: ['./np-status-pill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NpStatusPillComponent {
  @Input() status: NpStatusPillEnum = NpStatusPillEnum.UNDEFINED;
}
