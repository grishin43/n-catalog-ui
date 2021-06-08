import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from './services/auth/auth.service';
import {AppRouteEnum} from '../models/app-route.enum';
import {CatalogRouteEnum} from '../catalog/models/catalog-route.enum';

@Component({
  selector: 'np-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (!this.authService.isLoggedIn()) {
      this.authService.retrieveToken(code);
    } else {
      this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.MAIN}`]);
    }
  }
}
