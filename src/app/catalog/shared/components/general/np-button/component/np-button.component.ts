import {Component, Input} from '@angular/core';

@Component({
  selector: 'np-button',
  templateUrl: './np-button.component.html',
  styleUrls: ['./np-button.component.scss']
})
export class NpButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'default' = 'primary';
  @Input() btnType: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean;
  @Input() autoMinWidth: boolean;
  @Input() minWidth: boolean;
  @Input() size: 'xs' | 'sm' | 'md' = 'md';
  @Input() light: boolean;
}
