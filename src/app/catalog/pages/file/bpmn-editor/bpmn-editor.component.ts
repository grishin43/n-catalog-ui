import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {ApiService} from '../../../services/api/api.service';
import {Subscription} from 'rxjs';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {EntitiesTabService} from '../../../services/entities-tab/entities-tab.service';
import {Router} from '@angular/router';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';

@Component({
  selector: 'np-bpmn-editor',
  templateUrl: './bpmn-editor.component.html',
  styleUrls: ['./bpmn-editor.component.scss']
})
export class BpmnEditorComponent implements OnInit, OnDestroy {
  @Input() set data(value: CatalogEntityModel) {
    this.file = value;
    if (this.file) {
      this.openFile();
    }
  }

  public file: CatalogEntityModel;

  private subscriptions = new Subscription();

  @HostListener('window:keydown', ['$event']) onKeyDown(e): any {
    if (e.ctrlKey && e.keyCode === 49) {
      // Ctrl + 1
      this.bpmnModelerService.zoomTo(true);
    } else if (e.ctrlKey && e.keyCode === 88) {
      // Ctrl + X
      this.bpmnModelerService.cutElements();
    } else if (e.keyCode === 27) {
      // Esc
      this.bpmnModelerService.cancelCutElements();
    } else if (e.ctrlKey && e.keyCode === 80) {
      // Ctrl + P
      e.preventDefault();
      this.bpmnModelerService.togglePropertiesPanel();
    } else if (e.ctrlKey && e.shiftKey && e.keyCode === 80) {
      // Ctrl + Shift + P
      e.preventDefault();
      this.bpmnModelerService.resetPropertiesPanel();
    } else if (e.ctrlKey && e.keyCode === 90) {
      // Ctrl + Z
      this.bpmnModelerService.increaseUndoCounter();
    } else if (e.ctrlKey && e.keyCode === 89) {
      // Ctrl + Y
      this.bpmnModelerService.decreaseUndoCounter();
    }
  }

  constructor(
    private apiService: ApiService,
    private bpmnToolbarService: BpmnToolbarService,
    private entitiesTabService: EntitiesTabService,
    private router: Router,
    private bpmnModelerService: BpmnModelerService
  ) {
  }

  ngOnInit(): void {
    this.initEditor();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initEditor(): void {
    this.bpmnModelerService.initModeler(
      '#bpmn-canvas',
      '#bpmn-properties',
      () => {
        this.openFile();
      }
    );
  }

  private openFile(): any {
    this.subscriptions.add(
      this.apiService.getXML(this.file.link)
        .subscribe((res) => {
            this.bpmnModelerService.openDiagram(res).then(() => {
              this.bpmnModelerService.zoomTo(true);
              this.bpmnModelerService.showTransactionBoundaries();
            });
          }
        )
    );
  }

  public togglePropertiesPanel(): void {
    this.bpmnModelerService.togglePropertiesPanel();
  }

}
