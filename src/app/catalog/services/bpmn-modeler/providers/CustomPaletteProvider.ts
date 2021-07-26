import {IPalette, IPaletteProvider} from '../bpmn-js/bpmn-js';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomPaletteProvider implements IPaletteProvider {
  private readonly elementFactory: any;

  constructor(
    private palette: IPalette,
    private originalPaletteProvider: IPaletteProvider, elementFactory) {
    this.palette.registerProvider(this);
    this.elementFactory = elementFactory;
  }

  getPaletteEntries(): any {
    return {
      colorPalette: {
        group: 'tools',
        className: ['color-palette', 'svg-icon'],
        title: 'Open color palette',
        action: {
          click: () => {
            const paletteTrigger = document.getElementById('color-palette-trigger');
            paletteTrigger.click();
          }
        }
      },
      wysiwyg: {
        group: 'tools',
        className: ['wysiwyg-editor', 'svg-icon'],
        title: 'Open WYSIWYG editor',
        action: {
          click: () => {
            const paletteTrigger = document.getElementById('wysiwyg-editor-trigger');
            paletteTrigger.click();
          }
        }
      }
    };
  }
}
