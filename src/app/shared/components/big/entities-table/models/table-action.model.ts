import {CatalogEntityActionEnum} from './catalog-entity-action.enum';

export interface TableActionModel {
  name: CatalogEntityActionEnum;
  cb: (value?: any) => void;
  disabled?: boolean;
  class?: string;
}
