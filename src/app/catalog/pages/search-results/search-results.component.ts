import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CatalogRouteEnum} from '../../models/catalog-route.enum';
import {Subscription} from 'rxjs';

@Component({
  selector: 'np-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public query: string;

  private subscription: Subscription;

  constructor(
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe((params: Params) => {
      this.query = params[CatalogRouteEnum._QUERY];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
