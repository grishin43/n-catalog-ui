import {Component, Input} from '@angular/core';

@Component({
  selector: 'np-avatar',
  templateUrl: './np-avatar.component.html',
  styleUrls: ['./np-avatar.component.scss']
})
export class NpAvatarComponent {
  @Input() type: 'initials' | 'avatar';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() data: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() selected: boolean;
}
