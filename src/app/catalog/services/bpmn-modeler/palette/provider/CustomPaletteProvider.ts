import {IPalette, IPaletteProvider} from '../bpmn-js/bpmn-js';
import {Injectable} from '@angular/core';
import {getCorrectBusinessObject} from '../../properties-panel/provider/utils';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

@Injectable({
  providedIn: 'root'
})
export class CustomPaletteProvider implements IPaletteProvider {

  static $inject = ['palette', 'originalPaletteProvider', 'elementFactory', 'commandStack'];

  private readonly elementFactory: any;
  private readonly commandStack: any;

  constructor(
    private palette: IPalette,
    private originalPaletteProvider: IPaletteProvider, elementFactory, commandStack) {
    this.palette.registerProvider(this);
    this.elementFactory = elementFactory;
    this.commandStack = commandStack;
  }


  getValue(businessObject): any {
    const documentation = businessObject && businessObject && businessObject.extendedDocumentation;
    return {extendedDocumentation: documentation};
  }

  setValue(businessObject, elem, values): any {
    return cmdHelper.updateBusinessObject(elem, businessObject, values);
  }

  getPaletteEntries(): any {
    return {
      colorPalette: {
        group: 'tools',
        className: ['color-palette', 'svg-icon'],
        title: 'Open color palette',
        action: {
          click: (e) => {
            try {
              const paletteTrigger = document.getElementById('color-palette-trigger');
              const domRect: DOMRect = e.target.getBoundingClientRect();
              const offsetX = domRect.x + domRect.width + 5;
              const offsetY = domRect.y;
              paletteTrigger.style.left = `${offsetX}px`;
              paletteTrigger.style.top = `${offsetY}px`;
              paletteTrigger.click();
            } catch (error) {
              console.error('Could not open color palette\n', error);
            }
          }
        }
      },
      wysiwyg: {
        group: 'tools',
        className: ['wysiwyg-editor', 'svg-icon'],
        title: 'Open WYSIWYG editor',
        action: {
          click: (e) => {
            try {
              const eventBus = (this.palette as any)._eventBus;
              const canvas = (this.palette as any)._canvas;
              const rootEl = canvas.getRootElement();
              const bo = getCorrectBusinessObject(rootEl, false);
              eventBus.fire('wysiwygEditor.open', {
                element: rootEl,
                isProcessDocumentation: true,
                data: this.getValue(bo).extendedDocumentation,
                node: e?.delegateTarget,
                eventBus
              });
              eventBus.once('wysiwygEditor.saveData', 999999, (event) => {
                const {element, data, isProcessDocumentation} = event;
                const updateElement = this.setValue(getCorrectBusinessObject(element, isProcessDocumentation), element, {
                  extendedDocumentation: data
                });
                console.log(updateElement);
                if (updateElement) {
                  const oldValue = this.getValue(bo).extendedDocumentation;
                  const newValue = updateElement.context?.properties?.extendedDocumentation;
                  if (oldValue !== newValue) {
                    this.commandStack.execute(updateElement.cmd, updateElement.context);
                  }
                }
                return false;
              });
            } catch (error) {
              console.error('Could not open WYSIWYG editor\n', error);
            }
          }
        }
      }
    };
  }
}
