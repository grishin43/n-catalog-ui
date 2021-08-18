import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Subscription} from 'rxjs';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {AnimationsHelper} from '../../../helpers/animations.helper';
import {BpmnPaletteSchemeModel} from '../../../models/bpmn/bpmn-palette-scheme.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {WysiwygEditorComponent} from '../wysiwyg-editor/wysiwyg-editor.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {HttpErrorResponse} from '@angular/common/http';
import {ProcessModel} from '../../../../models/domain/process.model';

@Component({
  selector: 'np-bpmn-editor',
  templateUrl: './bpmn-editor.component.html',
  styleUrls: ['./bpmn-editor.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class BpmnEditorComponent implements OnInit, OnDestroy {
  @Input() set data(value: ProcessModel) {
    this.process = value;
    this.openProcess();
  }

  public process: ProcessModel;
  public processLoader: boolean;
  public processLoadingError: HttpErrorResponse;
  public paletteColors: BpmnPaletteSchemeModel[];

  private subscriptions = new Subscription();
  private readonly newDiagramLink = '../../../assets/bpmn/newDiagram.bpmn';

  @HostListener('window:keydown', ['$event']) onKeyDown(e): any {
    if (e.ctrlKey && e.keyCode === 49) {
      // Ctrl + 1
      this.bpmnModeler.zoomTo(true);
    } else if (e.ctrlKey && e.keyCode === 88) {
      // Ctrl + X
      this.bpmnModeler.cutElements();
    } else if (e.keyCode === 27) {
      // Esc
      this.bpmnModeler.cancelCutElements();
    } else if (e.ctrlKey && e.keyCode === 80) {
      // Ctrl + P
      e.preventDefault();
      this.bpmnModeler.togglePropertiesPanel();
    } else if (e.ctrlKey && e.shiftKey && e.keyCode === 80) {
      // Ctrl + Shift + P
      e.preventDefault();
      this.bpmnModeler.resetPropertiesPanel();
    } else if (e.ctrlKey && e.keyCode === 90) {
      // Ctrl + Z
      this.bpmnModeler.increaseUndoCounter();
    } else if (e.ctrlKey && e.keyCode === 89) {
      // Ctrl + Y
      this.bpmnModeler.decreaseUndoCounter();
    }
  }

  constructor(
    private apiService: ApiService,
    public bpmnModeler: BpmnModelerService,
    private bpmnToolbar: BpmnToolbarService,
    private bottomSheet: MatBottomSheet
  ) {
  }

  ngOnInit(): void {
    this.paletteColors = this.bpmnToolbar.paletteColors;
    this.initEditor();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initEditor(): void {
    this.bpmnModeler.initModeler(
      '#bpmn-canvas',
      '#bpmn-properties',
      () => {
        this.openProcess();
      }
    );
  }

  private openProcess(): any {
    if (this.process) {
      if (this.process.activeResource) {
        this.openDiagram(this.process.activeResource.content);
      } else {
        this.openNewDiagram();
      }
    }
  }

  private openDiagram(xml: string): void {
    this.bpmnModeler.openDiagram(xml).then(() => {
      this.bpmnModeler.zoomTo(true);
      this.processLoader = false;
    });
  }

  private openNewDiagram(): void {
    this.processLoadingError = undefined;
    this.processLoader = true;
    this.subscriptions.add(
      this.apiService.getXML(this.newDiagramLink)
        .subscribe(
          (res: string) => this.openDiagram(res),
          (err: HttpErrorResponse) => {
            this.processLoader = false;
            this.processLoadingError = err;
            console.error(err);
          }
        )
    );
  }

  public togglePropertiesPanel(): void {
    this.bpmnModeler.togglePropertiesPanel();
  }

  public openWysiwygEditor(): void {
    this.bottomSheet.open(WysiwygEditorComponent);
  }

  public reloadPage(): void {
    window.location.reload();
  }

}
