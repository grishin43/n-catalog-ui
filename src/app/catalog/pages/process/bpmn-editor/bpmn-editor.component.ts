import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Observable, Subscription} from 'rxjs';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {BpmnPaletteSchemeModel} from '../../../models/bpmn/bpmn-palette-scheme.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {HttpErrorResponse} from '@angular/common/http';
import {CurrentProcessModel} from '../../../models/current-process.model';
import {ProcessAutosaveService} from '../../../services/process-autosave/process-autosave.service';
import {validate} from 'fast-xml-parser';
import {TranslateService} from '@ngx-translate/core';
import {WindowHelper} from '../../../../helpers/window.helper';
import {DocumentationDialogComponent} from '../documentation-dialog/documentation-dialog.component';
import {ProcessService} from '../../folder/services/process/process.service';
import {Select} from '@ngxs/store';
import {CatalogSelectors} from '../../../store/selectors/catalog.selectors';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {ResourceModel} from '../../../../models/domain/resource.model';
import {ToastService} from '../../../../toast/service/toast.service';

@Component({
  selector: 'np-bpmn-editor',
  templateUrl: './bpmn-editor.component.html',
  styleUrls: ['./bpmn-editor.component.scss']
})
export class BpmnEditorComponent implements OnInit, OnDestroy {
  @Select(CatalogSelectors.currentProcessId) processId$: Observable<string>;
  @Select(CatalogSelectors.currentProcessActiveResource) processResource$: Observable<ResourceModel>;
  @SelectSnapshot(CatalogSelectors.currentProcess) process: CurrentProcessModel;

  @Output() diagramWasChanged = new EventEmitter<boolean>();

  public errorResponse: HttpErrorResponse;
  public paletteColors: BpmnPaletteSchemeModel[];

  private subscriptions = new Subscription();
  private readonly newDiagramLink = '../../../assets/bpmn/newDiagram.bpmn';

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.code === 'Digit1') {
      e.preventDefault();
      this.bpmnModelerService.zoomTo(true);
    } else if (e.ctrlKey && e.code === 'KeyX') {
      e.preventDefault();
      this.bpmnModelerService.cutElements();
    } else if (e.code === 'Escape') {
      e.preventDefault();
      this.bpmnModelerService.cancelCutElements();
    } else if (e.ctrlKey && e.code === 'KeyP') {
      e.preventDefault();
      this.bpmnModelerService.togglePropertiesPanel();
    } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyP') {
      e.preventDefault();
      this.bpmnModelerService.resetPropertiesPanel();
    } else if (e.ctrlKey && e.code === 'KeyZ') {
      e.preventDefault();
      this.bpmnModelerService.increaseUndoCounter();
    } else if (e.ctrlKey && e.code === 'KeyY') {
      e.preventDefault();
      this.bpmnModelerService.decreaseUndoCounter();
    } else if (e.ctrlKey && e.code === 'KeyS') {
      e.preventDefault();
      if (this.process && this.processAutosave.shouldSaved && !this.process.blocked && !this.process.isLocked) {
        this.processAutosave.saveProcess();
      }
    }
  }

  @HostListener('window:dragover', ['$event']) onDrag(e: DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('window:drop', ['$event']) onDrop(e: DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (pe: ProgressEvent<FileReader>): void => {
        const xml = pe.target.result;
        this.openDiagram(xml as string, true);
      };
      reader.readAsText(file);
    }
  }

  constructor(
    private api: ApiService,
    public bpmnModelerService: BpmnModelerService,
    private bpmnToolbarService: BpmnToolbarService,
    private bottomSheet: MatBottomSheet,
    private processAutosave: ProcessAutosaveService,
    private toast: ToastService,
    private translate: TranslateService,
    private processService: ProcessService
  ) {
  }

  ngOnInit(): void {
    this.paletteColors = this.bpmnToolbarService.paletteColors;
    this.initEditor();
    this.subscribeProcessChange(this.processId$);
    this.subscribeProcessChange(this.processResource$);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeProcessChange(obs: Observable<any>): void {
    this.subscriptions.add(
      obs.subscribe(() => {
        this.disableSaveHelpers();
        this.openProcess();
      })
    );
  }

  private initEditor(): void {
    this.bpmnModelerService.initModeler(
      '#bpmn-canvas',
      '#bpmn-properties',
      () => {
        this.listenModelerChanges();
        this.listenOpenWysiwygEditor();
      }
    );
  }

  private listenOpenWysiwygEditor(): void {
    this.bpmnModelerService.listenOpenWysiwygEditor((e: any) => {
      const bottomSheetRef = this.bottomSheet.open(DocumentationDialogComponent, {
        data: e?.data,
        panelClass: 'wysiwygEditor'
      });
      this.subscriptions.add(
        bottomSheetRef.afterDismissed().subscribe((res: string) => {
          e.eventBus.fire(
            'wysiwygEditor.saveData',
            {
              element: e?.element,
              node: e?.node,
              isProcessDocumentation: e?.isProcessDocumentation,
              data: res
            }
          );
        })
      );
    });
  }

  private openProcess(): void {
    if (this.process) {
      if (this.process.activeResource) {
        this.openDiagram(this.process.activeResource.content);
      } else {
        this.openNewDiagram();
      }
      if (this.bpmnModelerService.modeler) {
        this.bpmnModelerService.togglePaletteVisibility(this.process?.isLocked);
      }
    }
  }

  private openDiagram(xml: string, shouldSavedAfter?: boolean): void {
    if (validate(xml) === true) {
      this.bpmnModelerService.openDiagram(xml).then(() => {
        this.processService.loader$.next(false);
        if (shouldSavedAfter) {
          this.processAutosave.shouldSaved = shouldSavedAfter;
        }
        this.bpmnModelerService.zoomTo(true);
      });
    } else {
      this.processService.loader$.next(false);
      this.toast.showError(
        'errors.errorOccurred',
        this.translate.instant('errors.processCannotBeOpened')
      );
      // TODO: reload process;
    }
  }

  private listenModelerChanges(): void {
    this.bpmnModelerService.listenChanges(() => {
      if (this.bpmnModelerService.canUndo) {
        this.processAutosave.restartTimer();
        WindowHelper.enableBeforeUnload();
        this.diagramWasChanged.emit(true);
      } else {
        this.disableSaveHelpers();
      }
    });
  }

  private disableSaveHelpers(): void {
    this.processAutosave.destroyTimer();
    WindowHelper.disableBeforeUnload();
  }

  private openNewDiagram(): void {
    this.errorResponse = undefined;
    this.subscriptions.add(
      this.api.getXML(this.newDiagramLink)
        .subscribe(
          (res: string) => this.openDiagram(res),
          (err: HttpErrorResponse) => {
            this.errorResponse = err;
          }
        )
    );
  }

  public togglePropertiesPanel(): void {
    this.bpmnModelerService.togglePropertiesPanel();
  }

  public get isLocked(): boolean {
    return this.process?.isLocked;
  }

}
