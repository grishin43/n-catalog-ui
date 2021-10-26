import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Subscription} from 'rxjs';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {AnimationsHelper} from '../../../helpers/animations.helper';
import {BpmnPaletteSchemeModel} from '../../../models/bpmn/bpmn-palette-scheme.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {HttpErrorResponse} from '@angular/common/http';
import {ProcessModel} from '../../../../models/domain/process.model';
import {ProcessAutosaveService} from '../../../services/process-autosave/process-autosave.service';
import {validate} from 'fast-xml-parser';
import {ToastService} from '../../../../shared/components/small/toast/service/toast.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {HttpStatusCodeEnum} from '../../../../models/http-status-code.enum';
import {WindowHelper} from '../../../../helpers/window.helper';
import {MatDialog} from '@angular/material/dialog';
import {DocumentationDialogComponent} from '../documentation-dialog/documentation-dialog.component';

@Component({
  selector: 'np-bpmn-editor',
  templateUrl: './bpmn-editor.component.html',
  styleUrls: ['./bpmn-editor.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class BpmnEditorComponent implements OnInit, OnDestroy {
  @Input() set data(value: ProcessModel) {
    if (value) {
      if (this.process && value.id !== this.process.id) {
        this.disableSaveHelpers();
      }
      this.process = value;
      this.processLoader = true;
      this.processAutosave.init(value);
      this.openProcess();
    }
  }

  @Input() processLoadError: HttpErrorResponse;

  public process: ProcessModel;
  public processLoader: boolean;
  public errorResponse: HttpErrorResponse;
  public paletteColors: BpmnPaletteSchemeModel[];

  private subscriptions = new Subscription();
  private readonly newDiagramLink = '../../../assets/bpmn/newDiagram.bpmn';
  public httpStatusCode = HttpStatusCodeEnum;

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
      if (this.process) {
        this.processAutosave.saveProcess(this.process);
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
    const reader = new FileReader();
    reader.onload = (pe: ProgressEvent<FileReader>): void => {
      const xml = pe.target.result;
      this.openDiagram(xml as string);
    };
    reader.readAsText(file);
  }

  constructor(
    private api: ApiService,
    public bpmnModelerService: BpmnModelerService,
    private bpmnToolbarService: BpmnToolbarService,
    private bottomSheet: MatBottomSheet,
    private processAutosave: ProcessAutosaveService,
    private toast: ToastService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.paletteColors = this.bpmnToolbarService.paletteColors;
    this.initEditor();
  }

  ngOnDestroy(): void {
    this.processAutosave.destroy();
    this.subscriptions.unsubscribe();
  }

  private initEditor(): void {
    this.bpmnModelerService.initModeler(
      '#bpmn-canvas',
      '#bpmn-properties',
      () => {
        this.listenModelerChanges();
        this.listenOpenWysiwygEditor();
        this.openProcess();
      }
    );
  }

  private listenOpenWysiwygEditor(): void {
    this.bpmnModelerService.listenOpenWysiwygEditor((e: any) => {
      const dialogRef = this.dialog.open(DocumentationDialogComponent, {
        width: '100%',
        autoFocus: false,
        data: e?.data
      });
      this.subscriptions.add(
        dialogRef.afterClosed().subscribe((res: string) => {
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
    }
  }

  private openDiagram(xml: string): void {
    if (validate(xml) === true) {
      this.bpmnModelerService.openDiagram(xml).then(() => {
        this.bpmnModelerService.zoomTo(true);
        this.processLoader = false;
      });
    } else {
      this.processLoader = false;
      this.toast.showError(
        'errors.errorOccurred',
        this.translate.instant('errors.processCannotBeOpened')
      );
    }
  }

  private listenModelerChanges(): void {
    this.bpmnModelerService.listenChanges(() => {
      if (this.bpmnModelerService.canUndo) {
        this.processAutosave.restartTimer();
        WindowHelper.enableBeforeUnload();
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
    this.processLoader = true;
    this.subscriptions.add(
      this.api.getXML(this.newDiagramLink)
        .subscribe(
          (res: string) => this.openDiagram(res),
          (err: HttpErrorResponse) => {
            this.processLoader = false;
            this.errorResponse = err;
          }
        )
    );
  }

  public togglePropertiesPanel(): void {
    this.bpmnModelerService.togglePropertiesPanel();
  }

  public reloadPage(): void {
    window.location.reload();
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }

}
