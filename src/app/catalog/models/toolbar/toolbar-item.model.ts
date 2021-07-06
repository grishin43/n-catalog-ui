import {ToolbarItemEnum} from './toolbar-item.enum';
import {ToolbarFileItemEnum} from './toolbar-file-item.enum';
import {FileTypeEnum} from '../file-type.enum';
import {ToolbarEditItemEnum} from './toolbar-edit-item.enum';
import {ToolbarAlignmentEnum} from './toolbar-alignment.enum';
import {ToolbarDistributionEnum} from './toolbar-distribution.enum';
import {ToolbarMovementEnum} from './toolbar-movement.enum';
import {ToolbarWindowItemEnum} from './toolbar-window-item.enum';
import {CatalogEntityModel} from '../catalog-entity.model';

export interface ToolbarItemModel {
    name: ToolbarItemEnum | ToolbarFileItemEnum | FileTypeEnum | ToolbarEditItemEnum | ToolbarAlignmentEnum
        | ToolbarDistributionEnum | ToolbarMovementEnum | ToolbarWindowItemEnum;
    hotkey?: string;
    subItems?: ToolbarItemModel[];
    delimiterAfter?: boolean;
    cb?: (fileRef?: CatalogEntityModel) => void;
}
