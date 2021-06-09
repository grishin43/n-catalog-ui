import {ToolbarItemModel} from '../models/toolbar/toolbar-item.model';
import {ToolbarItemEnum} from '../models/toolbar/toolbar-item.enum';
import {ToolbarFileItemEnum} from '../models/toolbar/toolbar-file-item.enum';
import {FileTypeEnum} from '../models/file-type.enum';
import {ToolbarEditItemEnum} from '../models/toolbar/toolbar-edit-item.enum';
import {ToolbarWindowItemEnum} from '../models/toolbar/toolbar-window-item.enum';

export class FileToolbarHelper {

  public static get topToolbar(): ToolbarItemModel[] {
    return [
      {
        name: ToolbarItemEnum.FILE,
        subItems: [
          {
            name: ToolbarFileItemEnum.DOWNLOAD_FILE,
            subItems: [
              {
                name: FileTypeEnum.BPMN
              },
              {
                name: FileTypeEnum.JPEG
              }
            ]
          },
          {
            name: ToolbarFileItemEnum.SAVE_VERSION
          },
          {
            name: ToolbarFileItemEnum.NEW_FILE,
            delimiterAfter: true
          },
          {
            name: ToolbarFileItemEnum.GRANT_ACCESS,
            delimiterAfter: true
          },
          {
            name: ToolbarFileItemEnum.COPY
          },
          {
            name: ToolbarFileItemEnum.RENAME
          },
          {
            name: ToolbarFileItemEnum.MOVE
          }
        ]
      },
      {
        name: ToolbarItemEnum.EDIT,
        subItems: [
          {
            name: ToolbarEditItemEnum.UNDO
          },
          {
            name: ToolbarEditItemEnum.REDO
          }
        ]
      },
      {
        name: ToolbarItemEnum.WINDOW,
        subItems: [
          {
            name: ToolbarWindowItemEnum.ZOOM_IN
          },
          {
            name: ToolbarWindowItemEnum.ZOOM_OUT
          },
          {
            name: ToolbarWindowItemEnum.FULLSCREEN
          }
        ]
      }
    ];
  }

}
