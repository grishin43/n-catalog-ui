import {ToolbarEditItemEnum} from './toolbar-edit-item.enum';

export interface ToolbarBlockerModel {
  name: ToolbarEditItemEnum | string;
  allow: boolean;
  some?: any;
}
