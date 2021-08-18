import {ProcessModel} from '../../../models/domain/process.model';

export interface ToolbarItemModel {
  name: string;
  hotkey?: string;
  subItems?: ToolbarItemModel[];
  delimiterAfter?: boolean;
  cb?: (process?: ProcessModel) => void;
}
