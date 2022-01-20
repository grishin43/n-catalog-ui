import {CurrentProcessModel} from '../current-process.model';

export interface ToolbarItemModel {
  name: string;
  hotkey?: string;
  subItems?: ToolbarItemModel[];
  delimiterAfter?: boolean;
  cb?: (process?: CurrentProcessModel) => void;
}
