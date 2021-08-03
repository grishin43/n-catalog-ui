import {CatalogEntityModel} from '../../../../../catalog/models/catalog-entity.model';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';

export interface InjectableDataModel {
  parent?: CatalogEntityModel;
  type?: CatalogEntityEnum;
  ssCb?: () => void;
}
