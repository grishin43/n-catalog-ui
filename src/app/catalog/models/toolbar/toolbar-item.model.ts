import {CatalogEntityModel} from '../catalog-entity.model';

export interface ToolbarItemModel {
  name: string;
  hotkey?: string;
  subItems?: ToolbarItemModel[];
  delimiterAfter?: boolean;
  cb?: (entity?: CatalogEntityModel) => void;
}
