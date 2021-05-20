import {State} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {CatalogStateModel} from '../models/catalog-state.model';

@State<CatalogStateModel>({
  name: 'catalog',
  defaults: null
})

@Injectable()
export class CatalogState {
  constructor() {
  }
}
