import {IPalette, IPaletteProvider} from '../bpmn-js/bpmn-js';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomPaletteProvider implements IPaletteProvider {

  static $inject = ['palette', 'originalPaletteProvider', 'elementFactory'];

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
              console.log('Could not open color palette\n', error);
            }
          }
        }
      }
    };
  }
}
