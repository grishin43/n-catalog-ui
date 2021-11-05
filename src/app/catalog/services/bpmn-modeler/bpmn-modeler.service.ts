import {Injectable} from '@angular/core';
import {Base64} from 'js-base64';
import {BpmnPositionEnum} from '../../models/bpmn/bpmn-position.enum';
import {BpmnDirectionEnum} from '../../models/bpmn/bpmn-direction.enum';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import {BpmnSpeedEnum} from '../../models/bpmn/bpmn-speed.enum';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import lintModule from 'bpmn-js-bpmnlint';
// @ts-ignore
import bpmnlintConfig from '.bpmnlintrc';
import transactionBoundariesModule from 'bpmn-js-transaction-boundaries';
import {BpmnPaletteSchemeModel} from '../../models/bpmn/bpmn-palette-scheme.model';
import {InjectionNames, OriginalPaletteProvider} from './palette/bpmn-js/bpmn-js';
import {CustomPaletteProvider} from './palette/provider/CustomPaletteProvider';
import {ToastService} from '../../../shared/components/small/toast/service/toast.service';
import {default as camundaModdleDescriptor} from 'camunda-bpmn-moddle/resources/camunda.json';
import resizeTask from 'bpmn-js-task-resize/lib';
import {default as documentationModdleDescriptor} from './properties-panel/descriptors/documentation.json';
import embeddedCommentsModule from './embedded-comments';

@Injectable({
  providedIn: 'root'
})
export class BpmnModelerService {
  public schemeValidatorActive = false;
  public tokenSimulationActive = false;
  public transactionBoundariesActive = false;
  public embeddedCommentsActive = false;

  public modeler: any;
  public panelSelector: string;

  private undoCounter = 0;

  constructor(
    private toast: ToastService
  ) {
  }

  public get canPaste(): boolean {
    try {
      const clipboardData = this.modeler.get('copyPaste')._clipboard._data;
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
      return this.modeler.get('commandStack')._stackIdx !== -1;
    } catch (e) {
      console.error('Could not get `stackIdx`\n', e);
    }
  }

  public get hasSelectedElements(): boolean {
    try {
      return this.modeler.get('selection').get('selectedElements').length;
    } catch (e) {
      console.error('Could not get `selectedElements`\n', e);
    }
  }

  public initModeler(containerSelector: string, propertiesPanelSelector: string, cb: () => void): void {
    if (window.hasOwnProperty('BpmnJS')) {
      this.panelSelector = propertiesPanelSelector;
      // @ts-ignore
      this.modeler = new BpmnJS({
        container: containerSelector,
        keyboard: {
          bindTo: window
        },
        linting: {
          bpmnlint: bpmnlintConfig
        },
        additionalModules: [
          propertiesPanelModule,
          bpmnPropertiesProviderModule,
          camundaModdleDescriptor,
          // Re-use original palette, see CustomPaletteProvider
          {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},
          {[InjectionNames.paletteProvider]: ['type', CustomPaletteProvider]},
          TokenSimulationModule,
          lintModule,
          transactionBoundariesModule,
          resizeTask,
          embeddedCommentsModule
        ],
        propertiesPanel: {
          parent: propertiesPanelSelector
        },
        moddleExtensions: {
          camunda: camundaModdleDescriptor,
          documentation: documentationModdleDescriptor
        },
        taskResizingEnabled: true
      });
      cb();
      this.listenPasteElements();
    }
  }

  public listenOpenWysiwygEditor(cb: (e?: any) => void): void {
    try {
      this.modeler.get('eventBus').on('wysiwygEditor.open', 999999, cb);
    } catch (e) {
      console.error('Could not set `wysiwygEditor.open` listener\n', e);
    }
  }

  public listenChanges(cb: () => void): void {
    try {
      this.modeler.get('eventBus').on('commandStack.changed', 999999, cb);
    } catch (e) {
      console.error('Could not set `changes` listener\n', e);
    }
  }

  private listenPasteElements(): void {
    try {
      this.modeler.get('eventBus').on('copyPaste.pasteElement', 999999, () => {
        this.cancelCutElements();
      });
    } catch (e) {
      console.error('Could not set `paste` listener\n', e);
    }
  }

  public paintElements(paletteColor: BpmnPaletteSchemeModel): void {
    try {
      const modeling = this.modeler.get('modeling');
      const selectedElements = this.modeler.get('selection').get('selectedElements');
      if (selectedElements.length) {
        modeling.setColor(selectedElements, paletteColor);
      }
    } catch (e) {
      console.error('Could not set elements color\n', e);
    }
  }

  public moveCanvasSelection(direction: BpmnDirectionEnum, speed: BpmnSpeedEnum): void {
    try {
      const keyboardMoveSelection = this.modeler.get('keyboardMoveSelection');
      if (keyboardMoveSelection) {
        keyboardMoveSelection.moveSelection(direction, speed);
      }
    } catch (e) {
      console.error('Could not move selection\n', e);
    }
  }

  public moveCanvas(direction: BpmnDirectionEnum, speed: BpmnSpeedEnum, invertY?: boolean): void {
    try {
      const canvasRef = this.modeler.get('canvas');
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
      console.error('Could not move canvas\n', e);
    }
  }

  public distributeElements(type: BpmnDirectionEnum): void {
    try {
      const selectedElements = this.modeler.get('selection').get('selectedElements');
      if (selectedElements) {
        this.modeler.get('distributeElements').trigger(selectedElements, type);
      }
    } catch (e) {
      console.error('Could not distribute elements\n', e);
    }
  }

  public alignElements(type: BpmnPositionEnum): void {
    try {
      const selectedElements = this.modeler.get('selection').get('selectedElements');
      if (selectedElements) {
        this.modeler.get('alignElements').trigger(selectedElements, type);
      }
    } catch (e) {
      console.error('Could not align elements\n', e);
    }
  }

  public selectAllElements(): void {
    try {
      const rootElement = this.modeler.get('canvas').getRootElement();
      const elements = this.modeler.get('elementRegistry').filter((element) => {
        return element !== rootElement;
      });
      this.modeler.get('selection').select(elements);
    } catch (e) {
      console.error('Could not select all elements\n', e);
    }
  }

  public openSearchPad(): void {
    try {
      setTimeout(() => {
        this.modeler.get('searchPad').open();
      }, 0);
    } catch (e) {
      console.error('Could not open search pad\n', e);
    }
  }

  public editLabel(): void {
    try {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'e'
      }));
    } catch (e) {
      console.error('Could not enable element label editing\n', e);
    }
  }

  public selectGlobalConnectTool(): void {
    try {
      this.modeler.get('globalConnect').toggle();
    } catch (e) {
      console.error('Could not select global connect tool\n', e);
    }
  }

  public selectSpaceTool(): void {
    try {
      this.modeler.get('spaceTool').toggle();
    } catch (e) {
      console.error('Could not select space tool\n', e);
    }
  }

  public selectLassoTool(): void {
    try {
      this.modeler.get('lassoTool').toggle();
    } catch (e) {
      console.error('Could not select lasso tool\n', e);
    }
  }

  public selectHandTool(): void {
    try {
      this.modeler.get('handTool').toggle();
    } catch (e) {
      console.error('Could not select hand tool\n', e);
    }
  }

  public redoAction(): void {
    try {
      this.modeler.get('commandStack').redo();
      this.decreaseUndoCounter();
    } catch (e) {
      console.error('Could not redo action\n', e);
    }
  }

  public undoAction(): void {
    try {
      this.modeler.get('commandStack').undo();
      this.increaseUndoCounter();
    } catch (e) {
      console.error('Could not undo action\n', e);
    }
  }

  public copyElements(): void {
    try {
      const selectedElements = this.modeler.get('selection').get('selectedElements');
      this.modeler.get('copyPaste').copy(selectedElements);
    } catch (e) {
      console.error('Could not copy elements\n', e);
    }
  }

  public cutElements(): void {
    try {
      this.modeler.get('canvas')._container.classList.add('transparency-selections');
      const selectedElements = this.modeler.get('selection').get('selectedElements');
      this.modeler.get('copyPaste').copy(selectedElements);
    } catch (e) {
      console.error('Could not cut elements\n', e);
    }
  }

  public cancelCutElements(): void {
    try {
      this.modeler.get('copyPaste').copy([]);
      this.modeler.get('canvas')._container.classList.remove('transparency-selections');
    } catch (e) {
      console.error('Could not toggle container class\n', e);
    }
  }

  public pasteElements(): void {
    try {
      const elements = this.modeler.get('copyPaste')._clipboard._data;
      this.modeler.get('copyPaste').paste(elements);
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
      this.modeler.get('propertiesPanel').detach();
      this.modeler.get('propertiesPanel').attachTo(this.panelSelector);
    } catch (e) {
      console.error('Could not reset properties panel\n', e);
    }
  }

  public togglePropertiesPanel(): void {
    try {
      const containerRef = this.modeler.get('propertiesPanel')._container;
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
      const canvas = this.modeler.get('canvas');
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
      this.modeler.get('zoomScroll').stepZoom(1);
    } catch (e) {
      console.error('Could not zoom in\n', e);
    }
  }

  public zoomOut(): void {
    try {
      this.modeler.get('zoomScroll').stepZoom(-1);
    } catch (e) {
      console.error('Could not zoom out\n', e);
    }
  }

  public async exportDiagramAsSVG(processName: string): Promise<void> {
    try {
      const {svg} = await this.modeler.saveSVG();
      const encodedData = encodeURIComponent(svg);
      const a = document.createElement('a');
      a.href = `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`;
      a.download = `${processName}.svg`;
      a.click();
    } catch (err) {
      console.error('Could not save BPMN 2.0 diagram\n', err);
    }
  }

  public async exportDiagramAsJpeg(processName: string): Promise<void> {
    try {
      const {svg} = await this.modeler.saveSVG();
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
        a.download = `${processName}.jpeg`;
        a.href = canvasData;
        a.click();
      };
    } catch (err) {
      console.error('Could not save BPMN 2.0 diagram\n', err);
    }
  }

  public async getDiagramXml(): Promise<string> {
    const {xml} = await this.modeler.saveXML({format: true});
    return xml;
  }

  public async exportDiagramAsXML(processName: string): Promise<void> {
    try {
      const {xml} = await this.modeler.saveXML({format: true});
      const encodedData = encodeURIComponent(xml);
      const a = document.createElement('a');
      a.href = `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`;
      a.download = `${processName}.bpmn`;
      a.click();
    } catch (err) {
      console.error('Could not save BPMN 2.0 diagram\n', err);
    }
  }

  public async openDiagram(xml: string): Promise<void> {
    try {
      await this.modeler?.importXML(xml);
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

  public toggleSchemeValidatorPlugin(): void {
    try {
      const linting = this.modeler.get('linting');
      if (this.schemeValidatorActive === linting.isActive()) {
        linting.toggle();
      }
      this.schemeValidatorActive = !this.schemeValidatorActive;
      const messageKey = this.schemeValidatorActive
        ? 'common.schemeValidatorActivated'
        : 'common.schemeValidatorDeActivated';
      this.showToast(messageKey, 1500);
    } catch (err) {
      console.error('Could not toggle scheme validator plugin\n', err);
    }
  }

  public toggleTokenSimulationPlugin(): void {
    try {
      this.modeler.get('toggleMode').toggleMode();
      this.tokenSimulationActive = !this.tokenSimulationActive;
      const messageKey = this.tokenSimulationActive
        ? 'common.tokenSimulationActivated'
        : 'common.tokenSimulationDeActivated';
      this.showToast(messageKey, 1500);
    } catch (err) {
      console.error('Could not toggle token simulation plugin\n', err);
    }
  }

  public toggleTransactionBoundariesPlugin(): void {
    try {
      const transactionBoundaries = this.modeler.get('transactionBoundaries');
      this.transactionBoundariesActive ? transactionBoundaries.hide() : transactionBoundaries.show();
      this.transactionBoundariesActive = !this.transactionBoundariesActive;
      const messageKey = this.transactionBoundariesActive
        ? 'common.transactionBoundariesActivated'
        : 'common.transactionBoundariesDeActivated';
      this.showToast(messageKey, 1500);
    } catch (err) {
      console.error('Could not toggle transaction boundaries plugin\n', err);
    }
  }

  public toggleEmbeddedCommentsPlugin(): void {
    try {
      const comments = this.modeler.get('comments');
      this.embeddedCommentsActive ? comments.hide() : comments.show();
      this.embeddedCommentsActive = !this.embeddedCommentsActive;
      const messageKey = this.embeddedCommentsActive
        ? 'common.embeddedCommentsActivated'
        : 'common.embeddedCommentsDeActivated';
      this.showToast(messageKey, 1500);
    } catch (err) {
      console.error('Could not toggle embedded comments plugin\n', err);
    }
  }

  public showToast(i18nKey: string, duration?: number, action?: string): void {
    this.toast.show(i18nKey, duration, action, 'top', 'center', 'modeler-toast');
  }

}
