import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CatalogEntityModel} from '../models/catalog-entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntitiesTabService {
  public entity = new BehaviorSubject<CatalogEntityModel>(null);

  constructor() {
  }

  public addEntity(entity: CatalogEntityModel): void {
    this.entity.next(entity);
  }

  public deleteEntity(): void {
    this.entity.next(null);
  }

}
