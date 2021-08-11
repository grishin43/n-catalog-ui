import {CatalogEntityActionEnum} from './catalog-entity-action.enum';
import {FolderModel} from '../../../../../models/domain/folder.model';

export interface TableActionModel {
  name: CatalogEntityActionEnum;
  cb: (value?: any, parent?: FolderModel, ssCb?: () => void) => void;
  disabled?: boolean;
  class?: string;
}
