import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {FolderModel} from '../../../../../models/domain/folder.model';

export interface InjectableDataModel {
  parent?: FolderModel;
  type?: CatalogEntityEnum;
  ssCb?: () => void;
}
