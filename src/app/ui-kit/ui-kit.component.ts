import {Component, OnInit} from '@angular/core';
import {NpStatusPillEnum} from '../shared/components/small/np-status-pill/models/np-status-pill.enum';

@Component({
  selector: 'np-ui-kit',
  templateUrl: './ui-kit.component.html',
  styleUrls: ['./ui-kit.component.scss']
})
export class UiKitComponent {
  public statuses = NpStatusPillEnum;
}
