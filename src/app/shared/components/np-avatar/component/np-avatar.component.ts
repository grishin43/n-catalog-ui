import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'np-avatar',
  templateUrl: './np-avatar.component.html',
  styleUrls: ['./np-avatar.component.scss']
})
export class NpAvatarComponent implements OnInit {
  @Input() type: 'initials' | 'avatar';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() data: string;
  @Input() size: 'sm' | 'md' = 'sm';

  constructor() {
  }

  ngOnInit(): void {
  }

}
