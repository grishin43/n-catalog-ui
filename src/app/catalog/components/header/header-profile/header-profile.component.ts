import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../../auth/services/auth/auth.service';

@Component({
  selector: 'np-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss']
})
export class HeaderProfileComponent implements OnInit {
  @Input() firstLastName: string;
  @Input() avatar: string;
  @Input() position: string;

  constructor(
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  public logout(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.auth.logout();
  }

}
