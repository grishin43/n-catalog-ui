import {Component, Input} from '@angular/core';
import {ToolbarItemModel} from '../../../models/toolbar/toolbar-item.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {ToolbarEditItemEnum} from '../../../models/toolbar/toolbar-edit-item.enum';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {ProcessModel} from '../../../../models/domain/process.model';
import {ToolbarItemEnum} from '../../../models/toolbar/toolbar-item.enum';

@Component({
  selector: 'np-process-toolbar',
  templateUrl: './process-toolbar.component.html',
  styleUrls: ['./process-toolbar.component.scss']
})
export class ProcessToolbarComponent {
  @Input() process: ProcessModel;
  @Input() xmlMode: boolean;

  public tools: ToolbarItemModel[] = this.bpmnToolbar.toolbar;
  public toolbarEditItem = ToolbarEditItemEnum;
  public toolbarItem = ToolbarItemEnum;

  constructor(
    private bpmnToolbar: BpmnToolbarService,
    public bpmnModeler: BpmnModelerService
  ) {
  }

  public get isLocked(): boolean {
    return !!this.process?.lockedBy;
  }

}
