import {Component, Input, OnInit} from '@angular/core';
import {ToolbarItemModel} from '../../../models/toolbar/toolbar-item.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {CatalogEntityModel} from '../../../models/catalog-entity.model';
import {ToolbarEditItemEnum} from '../../../models/toolbar/toolbar-edit-item.enum';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';

@Component({
  selector: 'np-process-toolbar',
  templateUrl: './process-toolbar.component.html',
  styleUrls: ['./process-toolbar.component.scss']
})
export class ProcessToolbarComponent implements OnInit {
  @Input() process: CatalogEntityModel;

  public tools: ToolbarItemModel[];
  public toolbarEditItem = ToolbarEditItemEnum;

  constructor(
    private bpmnToolbar: BpmnToolbarService,
    public bpmnModeler: BpmnModelerService
  ) {
  }

  ngOnInit(): void {
    this.tools = this.bpmnToolbar.toolbar;
  }

}
