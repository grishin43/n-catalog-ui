import {Component, Input} from '@angular/core';

@Component({
  selector: 'np-button',
  templateUrl: './np-button.component.html',
  styleUrls: ['./np-button.component.scss']
})
export class NpButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'default' = 'primary';
  @Input() disabled: boolean;
  @Input() enableMinWidth: boolean;
  @Input() size: 'sm' | 'md' = 'md';
}
