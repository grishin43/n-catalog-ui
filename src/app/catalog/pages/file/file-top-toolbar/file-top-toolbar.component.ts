import {Component, Input, OnInit} from '@angular/core';
import {ToolbarItemModel} from '../../../models/toolbar/toolbar-item.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {ToolbarEditItemEnum} from '../../../models/toolbar/toolbar-edit-item.enum';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {BpmnPaletteSchemeModel} from '../../../models/bpmn/bpmn-palette-scheme.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {WysiwygEditorComponent} from '../wysiwyg-editor/wysiwyg-editor.component';

@Component({
  selector: 'np-file-top-toolbar',
  templateUrl: './file-top-toolbar.component.html',
  styleUrls: ['./file-top-toolbar.component.scss']
})
export class FileTopToolbarComponent implements OnInit {
  @Input() file: CatalogEntityModel;

  public tools: ToolbarItemModel[];
  public toolbarEditItem = ToolbarEditItemEnum;
  public paletteColors: BpmnPaletteSchemeModel[];

  constructor(
    private bpmnToolbar: BpmnToolbarService,
    public bpmnModeler: BpmnModelerService,
    private bottomSheet: MatBottomSheet
  ) {
  }

  ngOnInit(): void {
    this.tools = this.bpmnToolbar.toolbar;
    this.paletteColors = this.bpmnToolbar.paletteColors;
  }

  public openWysiwygEditor(): void {
    this.bottomSheet.open(WysiwygEditorComponent);
  }

}
