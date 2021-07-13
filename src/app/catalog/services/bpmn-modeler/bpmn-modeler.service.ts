import {Injectable} from '@angular/core';
import {Base64} from 'js-base64';
import {BpmnPositionEnum} from '../../models/bpmn/bpmn-position.enum';
import {BpmnDirectionEnum} from '../../models/bpmn/bpmn-direction.enum';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import {BpmnSpeedEnum} from '../../models/bpmn/bpmn-speed.enum';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import lintModule from 'bpmn-js-bpmnlint';
// @ts-ignore
import bpmnlintConfig from '.bpmnlintrc';

@Injectable({
  providedIn: 'root'
})
export class BpmnModelerService {
  public bpmnModeler: any;
  public bpmnPanelSelector: string;

  private undoCounter = 0;

  constructor() {
  }

  public get canPaste(): boolean {
    try {
      const clipboardData = this.bpmnModeler.get('copyPaste')._clipboard._data;
      if (clipboardData) {
        return !!Object.keys(clipboardData).length;
      } else {
        return false;
      }
    } catch (e) {
      console.error('Could not get clipboard data`\n', e);
    }
  }

  public get canRedo(): boolean {
    return !!this.undoCounter;
  }

  public get canUndo(): boolean {
    try {
      return this.bpmnModeler.get('commandStack')._stackIdx !== -1;
    } catch (e) {
      console.error('Could not get `stackIdx`\n', e);
    }
  }

  public get hasSelectedElements(): boolean {
    try {
      return this.bpmnModeler.get('selection').get('selectedElements').length;
    } catch (e) {
      console.error('Could not get `selectedElements`\n', e);
    }
  }

  public initModeler(containerSelector: string, propertiesPanelSelector: string, cb: () => void): void {
    if (window.hasOwnProperty('BpmnJS')) {
      this.bpmnPanelSelector = propertiesPanelSelector;
      // @ts-ignore
      this.bpmnModeler = new BpmnJS({
        container: containerSelector,
        keyboard: {
          bindTo: window
        },
        linting: {
          bpmnlint: bpmnlintConfig
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
          TokenSimulationModule,
          lintModule
        ],
        propertiesPanel: {
          parent: propertiesPanelSelector
        }
      });
      cb();
      this.listenPasteElements();
    }
  }

  private listenPasteElements(): void {
    try {
      this.bpmnModeler.get('eventBus').on('copyPaste.pasteElement', 999999, (event) => {
        this.cancelCutElements();
      });
    } catch (e) {
      console.log('Could not set `paste` listener\n', e);
    }
  }

  public moveCanvasSelection(direction: BpmnDirectionEnum, speed: BpmnSpeedEnum): void {
    try {
      const keyboardMoveSelection = this.bpmnModeler.get('keyboardMoveSelection');
      if (keyboardMoveSelection) {
        keyboardMoveSelection.moveSelection(direction, speed);
      }
    } catch (e) {
      console.log('Could not move selection\n', e);
    }
  }

  public moveCanvas(direction: BpmnDirectionEnum, speed: BpmnSpeedEnum, invertY?: boolean): void {
    try {
      const canvasRef = this.bpmnModeler.get('canvas');
      const actualSpeed = speed / Math.min(Math.sqrt(canvasRef.viewbox().scale), 1);
      let dx = 0;
      let dy = 0;
      switch (direction) {
        case BpmnDirectionEnum.UP:
          dy = actualSpeed;
          break;
        case BpmnDirectionEnum.DOWN:
          dy = -actualSpeed;
          break;
        case BpmnDirectionEnum.LEFT:
          dx = actualSpeed;
          break;
        case BpmnDirectionEnum.RIGHT:
          dx = -actualSpeed;
          break;
      }
      if (dy && invertY) {
        dy = -dy;
      }
      canvasRef.scroll({dx, dy});
    } catch (e) {
      console.log('Could not move canvas\n', e);
    }
  }

  public distributeElements(type: BpmnDirectionEnum): void {
    try {
      const selectedElements = this.bpmnModeler.get('selection').get('selectedElements');
      if (selectedElements) {
        this.bpmnModeler.get('distributeElements').trigger(selectedElements, type);
      }
    } catch (e) {
      console.log('Could not distribute elements\n', e);
    }
  }

  public alignElements(type: BpmnPositionEnum): void {
    try {
      const selectedElements = this.bpmnModeler.get('selection').get('selectedElements');
      if (selectedElements) {
        this.bpmnModeler.get('alignElements').trigger(selectedElements, type);
      }
    } catch (e) {
      console.log('Could not align elements\n', e);
    }
  }

  public selectAllElements(): void {
    try {
      const rootElement = this.bpmnModeler.get('canvas').getRootElement();
      const elements = this.bpmnModeler.get('elementRegistry').filter((element) => {
        return element !== rootElement;
      });
      this.bpmnModeler.get('selection').select(elements);
    } catch (e) {
      console.log('Could not select all elements\n', e);
    }
  }

  public openSearchPad(): void {
    try {
      setTimeout(() => {
        this.bpmnModeler.get('searchPad').open();
      }, 0);
    } catch (e) {
      console.log('Could not open search pad\n', e);
    }
  }

  public editLabel(): void {
    try {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'e'
      }));
    } catch (e) {
      console.log('Could not enable element label editing\n', e);
    }
  }

  public selectGlobalConnectTool(): void {
    try {
      this.bpmnModeler.get('globalConnect').toggle();
    } catch (e) {
      console.log('Could not select global connect tool\n', e);
    }
  }

  public selectSpaceTool(): void {
    try {
      this.bpmnModeler.get('spaceTool').toggle();
    } catch (e) {
      console.log('Could not select space tool\n', e);
    }
  }

  public selectLassoTool(): void {
    try {
      this.bpmnModeler.get('lassoTool').toggle();
    } catch (e) {
      console.log('Could not select lasso tool\n', e);
    }
  }

  public selectHandTool(): void {
    try {
      this.bpmnModeler.get('handTool').toggle();
    } catch (e) {
      console.log('Could not select hand tool\n', e);
    }
  }

  public redoAction(): void {
    try {
      this.bpmnModeler.get('commandStack').redo();
      this.decreaseUndoCounter();
    } catch (e) {
      console.log('Could not redo action\n', e);
    }
  }

  public undoAction(): void {
    try {
      this.bpmnModeler.get('commandStack').undo();
      this.increaseUndoCounter();
    } catch (e) {
      console.error('Could not undo action\n', e);
    }
  }

  public copyElements(): void {
    try {
      const selectedElements = this.bpmnModeler.get('selection').get('selectedElements');
      this.bpmnModeler.get('copyPaste').copy(selectedElements);
    } catch (e) {
      console.error('Could not copy elements\n', e);
    }
  }

  public cutElements(): void {
    try {
      this.bpmnModeler.get('canvas')._container.classList.add('transparency-selections');
      const selectedElements = this.bpmnModeler.get('selection').get('selectedElements');
      this.bpmnModeler.get('copyPaste').copy(selectedElements);
    } catch (e) {
      console.error('Could not cut elements\n', e);
    }
  }

  public cancelCutElements(): void {
    try {
      this.bpmnModeler.get('copyPaste').copy([]);
      this.bpmnModeler.get('canvas')._container.classList.remove('transparency-selections');
    } catch (e) {
      console.error('Could not toggle container class\n', e);
    }
  }

  public pasteElements(): void {
    try {
      const elements = this.bpmnModeler.get('copyPaste')._clipboard._data;
      this.bpmnModeler.get('copyPaste').paste(elements);
    } catch (e) {
      console.error('Could not paste elements\n', e);
    }
  }

  public deleteElements(): void {
    try {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Delete'
      }));
    } catch (e) {
      console.error('Could not delete elements\n', e);
    }
  }

  public resetPropertiesPanel(): void {
    try {
      this.bpmnModeler.get('propertiesPanel').detach();
      this.bpmnModeler.get('propertiesPanel').attachTo(this.bpmnPanelSelector);
    } catch (e) {
      console.error('Could not reset properties panel\n', e);
    }
  }

  public togglePropertiesPanel(): void {
    try {
      const containerRef = this.bpmnModeler.get('propertiesPanel')._container;
      if (containerRef.classList.contains('closed')) {
        containerRef.classList.remove('closed');
      } else {
        containerRef.classList.add('closed');
      }
    } catch (e) {
      console.error('Could not toggle properties panel\n', e);
    }
  }

  public toggleFullScreenMode(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  public zoomTo(auto?: boolean): void {
    try {
      const canvas = this.bpmnModeler.get('canvas');
      if (auto) {
        canvas.zoom('fit-viewport', 'auto');
      } else {
        canvas.zoom('fit-viewport');
      }
    } catch (e) {
      console.error('Could not zoom to\n', e);
    }
  }

  public zoomIn(): void {
    try {
      this.bpmnModeler.get('zoomScroll').stepZoom(1);
    } catch (e) {
      console.error('Could not zoom in\n', e);
    }
  }

  public zoomOut(): void {
    try {
      this.bpmnModeler.get('zoomScroll').stepZoom(-1);
    } catch (e) {
      console.error('Could not zoom out\n', e);
    }
  }

  public async exportDiagramAsSVG(fileName: string): Promise<void> {
    try {
      const {svg} = await this.bpmnModeler.saveSVG();
      const encodedData = encodeURIComponent(svg);
      const a = document.createElement('a');
      a.href = `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`;
      a.download = `${fileName}.svg`;
      a.click();
    } catch (err) {
      console.error('Could not save BPMN 2.0 diagram\n', err);
    }
  }

  public async exportDiagramAsJpeg(fileName: string): Promise<void> {
    try {
      const {svg} = await this.bpmnModeler.saveSVG();
      const imgWidth = +svg.match(/width="(.*?)"/)[1] || 0;
      const imgHeight = +svg.match(/height="(.*?)"/)[1] || 0;
      const imgSrc = `data:image/svg+xml;base64,${Base64.encode(svg)}`;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.setAttribute('width', imgWidth.toString());
      canvas.setAttribute('height', imgHeight.toString());
      const image = new Image();
      image.src = imgSrc;
      image.onload = () => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        const canvasData = canvas.toDataURL('image/jpeg');
        const a = document.createElement('a');
        a.download = `${fileName}.jpeg`;
        a.href = canvasData;
        a.click();
      };
    } catch (err) {
      console.error('Could not save BPMN 2.0 diagram\n', err);
    }
  }

  public async exportDiagramAsXML(fileName: string): Promise<void> {
    try {
      const {xml} = await this.bpmnModeler.saveXML({format: true});
      const encodedData = encodeURIComponent(xml);
      const a = document.createElement('a');
      a.href = `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`;
      a.download = `${fileName}.bpmn`;
      a.click();
    } catch (err) {
      console.error('Could not save BPMN 2.0 diagram\n', err);
    }
  }

  public async openDiagram(filePath: string): Promise<void> {
    try {
      await this.bpmnModeler.importXML(filePath);
    } catch (err) {
      console.error('Could not import BPMN 2.0 diagram\n', err);
    }
  }

  public increaseUndoCounter(): void {
    this.undoCounter++;
  }

  public decreaseUndoCounter(): void {
    this.undoCounter--;
  }

}
