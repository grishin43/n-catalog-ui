import {ToolbarItemModel} from '../models/toolbar/toolbar-item.model';
import {ToolbarItemEnum} from '../models/toolbar/toolbar-item.enum';

export class FileToolbarHelper {

  public static get topToolbar(): ToolbarItemModel[] {
    return [
      {
        id: ToolbarItemEnum.FILE,
        i18name: ToolbarItemEnum.FILE,
        subItems: [
          {
            id: '1',
            i18name: '1'
          }
        ]
      },
      {
        id: ToolbarItemEnum.EDIT,
        i18name: ToolbarItemEnum.EDIT
      },
      {
        id: ToolbarItemEnum.WINDOW,
        i18name: ToolbarItemEnum.WINDOW
      }
    ];
  }

}
