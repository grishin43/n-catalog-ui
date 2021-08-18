import {Component, Input, OnInit} from '@angular/core';
import {ToolbarItemModel} from '../../../models/toolbar/toolbar-item.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {ToolbarEditItemEnum} from '../../../models/toolbar/toolbar-edit-item.enum';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {ProcessModel} from '../../../../models/domain/process.model';

@Component({
  selector: 'np-process-toolbar',
  templateUrl: './process-toolbar.component.html',
  styleUrls: ['./process-toolbar.component.scss']
})
export class ProcessToolbarComponent implements OnInit {
  @Input() process: ProcessModel;

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
