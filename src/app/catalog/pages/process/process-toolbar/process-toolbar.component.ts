import {Component, Input, OnInit} from '@angular/core';
import {ToolbarItemModel} from '../../../models/toolbar/toolbar-item.model';
import {BpmnToolbarService} from '../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {ToolbarEditItemEnum} from '../../../models/toolbar/toolbar-edit-item.enum';
import {BpmnModelerService} from '../../../services/bpmn-modeler/bpmn-modeler.service';
import {CurrentProcessModel} from '../../../models/current-process.model';
import {ToolbarItemEnum} from '../../../models/toolbar/toolbar-item.enum';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'np-process-toolbar',
  templateUrl: './process-toolbar.component.html',
  styleUrls: ['./process-toolbar.component.scss']
})
export class ProcessToolbarComponent implements OnInit {
  @Input() process: CurrentProcessModel;
  @Input() xmlMode: boolean;

  public tools: ToolbarItemModel[];
  public toolbarEditItem = ToolbarEditItemEnum;
  public toolbarItem = ToolbarItemEnum;

  constructor(
    private bpmnToolbar: BpmnToolbarService,
    public bpmnModeler: BpmnModelerService
  ) {
  }

  ngOnInit(): void {
    this.tools = this.bpmnToolbar.getToolbar();
  }

  /**
   * Mat-menu issue: https://github.com/angular/components/issues/9969
   */
  public onMenuMouseLeave(event: MouseEvent, index: number, subMenuTrigger: MatMenuTrigger): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const relatedMatMenu = relatedTarget.closest(`.mat-menu-index-${index}`);
    if (!relatedMatMenu) {
      subMenuTrigger.closeMenu();
    }
  }

}
