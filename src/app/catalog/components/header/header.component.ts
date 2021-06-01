import {Component} from '@angular/core';
import {MatRippleHelper} from '../../helpers/mat-ripple.helper';

@Component({
  selector: 'np-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public rippleLightColor = MatRippleHelper.lightRippleColor;
}
