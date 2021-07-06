import {Injectable} from '@angular/core';
import {ToolbarItemModel} from '../../models/toolbar/toolbar-item.model';
import {ToolbarItemEnum} from '../../models/toolbar/toolbar-item.enum';
import {ToolbarFileItemEnum} from '../../models/toolbar/toolbar-file-item.enum';
import {FileTypeEnum} from '../../models/file-type.enum';
import {ToolbarEditItemEnum} from '../../models/toolbar/toolbar-edit-item.enum';
import {ToolbarWindowItemEnum} from '../../models/toolbar/toolbar-window-item.enum';
import {ToolbarAlignmentEnum} from '../../models/toolbar/toolbar-alignment.enum';
import {ToolbarDistributionEnum} from '../../models/toolbar/toolbar-distribution.enum';
import {ToolbarMovementEnum} from '../../models/toolbar/toolbar-movement.enum';
import {BpmnModelerService} from '../bpmn-modeler/bpmn-modeler.service';
import {CreateFileModalComponent} from '../../../shared/components/big/create-file-modal/component/create-file-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {BpmnDirectionEnum} from '../../models/bpmn/bpmn-direction.enum';
import {BpmnSpeedEnum} from '../../models/bpmn/bpmn-speed.enum';
import {BpmnPositionEnum} from '../../models/bpmn/bpmn-position.enum';
import {ToolbarBlockerModel} from '../../models/toolbar/toolbar-blocker.model';

@Injectable({
  providedIn: 'root'
})
export class BpmnToolbarService {

  constructor(
    private bpmnModeler: BpmnModelerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
  }

  public get toolbar(): ToolbarItemModel[] {
    return [
      {
        name: ToolbarItemEnum.FILE,
        subItems: [
          {
            name: ToolbarFileItemEnum.NEW_FILE,
            cb: () => {
              this.dialog.open(CreateFileModalComponent, {
                width: '700px',
                autoFocus: false
              });
            }
          },
          {
            name: ToolbarFileItemEnum.DOWNLOAD_FILE,
            subItems: [
              {
                name: FileTypeEnum.BPMN,
                cb: (fileRef: CatalogEntityModel) => this.bpmnModeler.exportDiagramAsXML(fileRef?.name)
              },
              {
                name: FileTypeEnum.JPEG,
                cb: (fileRef: CatalogEntityModel) => this.bpmnModeler.exportDiagramAsJpeg(fileRef?.name)
              },
              {
                name: FileTypeEnum.SVG,
                cb: (fileRef: CatalogEntityModel) => this.bpmnModeler.exportDiagramAsSVG(fileRef?.name)
              }
            ]
          },
          {
            name: ToolbarFileItemEnum.SAVE_VERSION,
            cb: () => {
              this.snackBar.open(this.translateService.instant('common.diagramVersionSaved'), 'OK', {
                duration: 3000
              });
            },
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
            name: ToolbarEditItemEnum.UNDO,
            hotkey: 'Ctrl + Z',
            cb: () => this.bpmnModeler.undoAction()
          },
          {
            name: ToolbarEditItemEnum.REDO,
            hotkey: 'Ctrl + Y',
            delimiterAfter: true,
            cb: () => this.bpmnModeler.redoAction()
          },
          {
            name: ToolbarEditItemEnum.COPY,
            hotkey: 'Ctrl + C',
            cb: () => this.bpmnModeler.copyElements()
          },
          {
            name: ToolbarEditItemEnum.CUT,
            hotkey: 'Ctrl + X',
            cb: () => this.bpmnModeler.cutElements()
          },
          {
            name: ToolbarEditItemEnum.PASTE,
            hotkey: 'Ctrl + V',
            delimiterAfter: true,
            cb: () => this.bpmnModeler.pasteElements()
          },
          {
            name: ToolbarEditItemEnum.HAND_TOOL,
            hotkey: 'H',
            cb: () => this.bpmnModeler.selectHandTool()
          },
          {
            name: ToolbarEditItemEnum.LASSO_TOOL,
            hotkey: 'L',
            cb: () => this.bpmnModeler.selectLassoTool()
          },
          {
            name: ToolbarEditItemEnum.SPACE_TOOL,
            cb: () => this.bpmnModeler.selectSpaceTool()
          },
          {
            name: ToolbarEditItemEnum.GLOBAL_CONNECTION_TOOL,
            hotkey: 'C',
            cb: () => this.bpmnModeler.selectGlobalConnectTool()
          },
          {
            name: ToolbarEditItemEnum.EDIT_LABEL,
            hotkey: 'E',
            delimiterAfter: true,
            cb: () => this.bpmnModeler.editLabel()
          },
          {
            name: ToolbarEditItemEnum.ALIGN_ELEMENTS,
            subItems: [
              {
                name: ToolbarAlignmentEnum.LEFT,
                cb: () => this.bpmnModeler.alignElements(BpmnPositionEnum.LEFT)
              },
              {
                name: ToolbarAlignmentEnum.RIGHT,
                cb: () => this.bpmnModeler.alignElements(BpmnPositionEnum.RIGHT)
              },
              {
                name: ToolbarAlignmentEnum.CENTER,
                cb: () => this.bpmnModeler.alignElements(BpmnPositionEnum.CENTER)
              },
              {
                name: ToolbarAlignmentEnum.TOP,
                cb: () => this.bpmnModeler.alignElements(BpmnPositionEnum.TOP)
              },
              {
                name: ToolbarAlignmentEnum.BOTTOM,
                cb: () => this.bpmnModeler.alignElements(BpmnPositionEnum.BOTTOM)
              },
              {
                name: ToolbarAlignmentEnum.MIDDLE,
                cb: () => this.bpmnModeler.alignElements(BpmnPositionEnum.MIDDLE)
              }
            ]
          },
          {
            name: ToolbarEditItemEnum.DISTRIBUTE_ELEMENTS,
            subItems: [
              {
                name: ToolbarDistributionEnum.DISTRIBUTE_HORIZONTALLY,
                cb: () => this.bpmnModeler.distributeElements(BpmnDirectionEnum.HORIZONTAL)
              },
              {
                name: ToolbarDistributionEnum.DISTRIBUTE_VERTICALLY,
                cb: () => this.bpmnModeler.distributeElements(BpmnDirectionEnum.VERTICAL)
              }
            ],
            delimiterAfter: true
          },
          {
            name: ToolbarEditItemEnum.FIND,
            hotkey: 'Ctrl + F',
            delimiterAfter: true,
            cb: () => this.bpmnModeler.openSearchPad()
          },
          {
            name: ToolbarEditItemEnum.MOVE_CANVAS,
            subItems: [
              {
                name: ToolbarMovementEnum.MOVE_UP,
                hotkey: 'Ctrl + ↑',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.UP, BpmnSpeedEnum.NORMAL)
              },
              {
                name: ToolbarMovementEnum.MOVE_UP_ACCELERATED,
                hotkey: 'Ctrl + Shift + ↑',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.UP, BpmnSpeedEnum.FAST)
              },
              {
                name: ToolbarMovementEnum.MOVE_LEFT,
                hotkey: 'Ctrl + ←',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.LEFT, BpmnSpeedEnum.NORMAL)
              },
              {
                name: ToolbarMovementEnum.MOVE_LEFT_ACCELERATED,
                hotkey: 'Ctrl + Shift + ←',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.LEFT, BpmnSpeedEnum.FAST)
              },
              {
                name: ToolbarMovementEnum.MOVE_DOWN,
                hotkey: 'Ctrl + ↓',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.DOWN, BpmnSpeedEnum.NORMAL)
              },
              {
                name: ToolbarMovementEnum.MOVE_DOWN_ACCELERATED,
                hotkey: 'Ctrl + Shift + ↓',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.DOWN, BpmnSpeedEnum.FAST)
              },
              {
                name: ToolbarMovementEnum.MOVE_RIGHT,
                hotkey: 'Ctrl + →',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.RIGHT, BpmnSpeedEnum.NORMAL)
              },
              {
                name: ToolbarMovementEnum.MOVE_RIGHT_ACCELERATED,
                hotkey: 'Ctrl + Shift + →',
                cb: () => this.bpmnModeler.moveCanvas(BpmnDirectionEnum.RIGHT, BpmnSpeedEnum.FAST)
              }
            ]
          },
          {
            name: ToolbarEditItemEnum.MOVE_SELECTION,
            subItems: [
              {
                name: ToolbarMovementEnum.MOVE_UP,
                hotkey: '↑',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.UP, BpmnSpeedEnum.DEFAULT)
              },
              {
                name: ToolbarMovementEnum.MOVE_UP_ACCELERATED,
                hotkey: 'Shift + ↑',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.UP, BpmnSpeedEnum.SLOW)
              },
              {
                name: ToolbarMovementEnum.MOVE_LEFT,
                hotkey: '←',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.LEFT, BpmnSpeedEnum.DEFAULT)
              },
              {
                name: ToolbarMovementEnum.MOVE_LEFT_ACCELERATED,
                hotkey: 'Shift + ←',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.LEFT, BpmnSpeedEnum.SLOW)
              },
              {
                name: ToolbarMovementEnum.MOVE_DOWN,
                hotkey: '↓',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.DOWN, BpmnSpeedEnum.DEFAULT)
              },
              {
                name: ToolbarMovementEnum.MOVE_DOWN_ACCELERATED,
                hotkey: 'Shift + ↓',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.DOWN, BpmnSpeedEnum.SLOW)
              },
              {
                name: ToolbarMovementEnum.MOVE_RIGHT,
                hotkey: '→',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.RIGHT, BpmnSpeedEnum.DEFAULT)
              },
              {
                name: ToolbarMovementEnum.MOVE_RIGHT_ACCELERATED,
                hotkey: 'Shift + →',
                cb: () => this.bpmnModeler.moveCanvasSelection(BpmnDirectionEnum.RIGHT, BpmnSpeedEnum.SLOW)
              }
            ]
          },
          {
            name: ToolbarEditItemEnum.SELECT_ALL,
            hotkey: 'Ctrl + A',
            cb: () => this.bpmnModeler.selectAllElements()
          },
          {
            name: ToolbarEditItemEnum.REMOVE_SELECTED,
            hotkey: 'Del',
            cb: () => this.bpmnModeler.deleteElements()
          }
        ]
      },
      {
        name: ToolbarItemEnum.WINDOW,
        subItems: [
          {
            name: ToolbarWindowItemEnum.ZOOM_IN,
            hotkey: 'Ctrl + =',
            cb: () => this.bpmnModeler.zoomIn()
          },
          {
            name: ToolbarWindowItemEnum.ZOOM_OUT,
            hotkey: 'Ctrl + -',
            cb: () => this.bpmnModeler.zoomOut()
          },
          {
            name: ToolbarWindowItemEnum.ZOOM_TO_ACTUAL_SIZE,
            hotkey: 'Ctrl + 0',
            cb: () => this.bpmnModeler.zoomTo()
          },
          {
            name: ToolbarWindowItemEnum.ZOOM_TO_FIT_DIAGRAM,
            hotkey: 'Ctrl + 1',
            delimiterAfter: true,
            cb: () => this.bpmnModeler.zoomTo(true)
          },
          {
            name: ToolbarWindowItemEnum.TOGGLE_PROPERTIES_PANEL,
            hotkey: 'Ctrl + P',
            cb: () => this.bpmnModeler.togglePropertiesPanel()
          },
          {
            name: ToolbarWindowItemEnum.RESET_PROPERTIES_PANEL,
            hotkey: 'Ctrl + Shift + P',
            delimiterAfter: true,
            cb: () => this.bpmnModeler.resetPropertiesPanel()
          },
          {
            name: ToolbarWindowItemEnum.TOGGLE_DEVTOOLS,
            hotkey: 'F12'
          },
          {
            name: ToolbarWindowItemEnum.FULLSCREEN,
            hotkey: 'F11',
            cb: () => this.bpmnModeler.toggleFullScreenMode()
          }
        ]
      }
    ];
  }

  public get blockers(): ToolbarBlockerModel[] {
    return [
      {
        name: ToolbarEditItemEnum.UNDO,
        allow: this.bpmnModeler.canUndo
      },
      {
        name: ToolbarEditItemEnum.REDO,
        allow: this.bpmnModeler.canRedo
      },
      {
        name: ToolbarEditItemEnum.COPY,
        allow: this.bpmnModeler.hasSelectedElements
      },
      {
        name: ToolbarEditItemEnum.CUT,
        allow: this.bpmnModeler.hasSelectedElements
      },
      {
        name: ToolbarEditItemEnum.REMOVE_SELECTED,
        allow: this.bpmnModeler.hasSelectedElements
      },
      {
        name: ToolbarEditItemEnum.PASTE,
        allow: this.bpmnModeler.canPaste
      },
      {
        name: ToolbarEditItemEnum.EDIT_LABEL,
        allow: this.bpmnModeler.hasSelectedElements
      }
    ];
  }

}
