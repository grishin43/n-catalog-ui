import {Component, Input, OnInit} from '@angular/core';
import {ToolbarItemModel} from '../../../../models/toolbar/toolbar-item.model';
import {BpmnModelerService} from '../../../../services/bpmn-modeler/bpmn-modeler.service';
import {BpmnToolbarService} from '../../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {ToolbarBlockerModel} from '../../../../models/toolbar/toolbar-blocker.model';
import {ToolbarPluginEnum} from '../../../../models/toolbar/toolbar-plugin.enum';
import {CurrentProcessModel} from '../../../../models/current-process.model';

@Component({
  selector: 'np-toolbar-action-btn',
  templateUrl: './toolbar-action-btn.component.html',
  styleUrls: ['./toolbar-action-btn.component.scss']
})
export class ToolbarActionBtnComponent implements OnInit {
  @Input() action: ToolbarItemModel;
  @Input() process: CurrentProcessModel;

  public toolbarPlugin = ToolbarPluginEnum;
  public disabled: boolean;
  public showTick: boolean;

  constructor(
    public bpmnModeler: BpmnModelerService,
    private bpmnToolbar: BpmnToolbarService
  ) {
  }

  ngOnInit(): void {
    this.disabled = this.isDisabled();
    this.showTick = this.checkTicks();
  }

  public isDisabled(): boolean {
    const match: ToolbarBlockerModel = this.bpmnToolbar.blockers.find((blocker: ToolbarBlockerModel) => {
      return blocker.name === this.action.name;
    });
    return match && !match.allow;
  }

  public checkTicks(): boolean {
    return this.isTransactionBoundariesAndActive
      || this.isTokenSimulationAndActive
      || this.isSchemeValidatorAndActive
      || this.isEmbeddedCommentsAndActive;
  }

  public get isTransactionBoundariesAndActive(): boolean {
    return this.action.name === this.toolbarPlugin.TRANSACTION_BOUNDARIES && this.bpmnModeler.transactionBoundariesActive;
  }

  public get isTokenSimulationAndActive(): boolean {
    return this.action.name === this.toolbarPlugin.TOKEN_SIMULATION && this.bpmnModeler.tokenSimulationActive;
  }

  public get isSchemeValidatorAndActive(): boolean {
    return this.action.name === this.toolbarPlugin.SCHEME_VALIDATOR && this.bpmnModeler.schemeValidatorActive;
  }

  public get isEmbeddedCommentsAndActive(): boolean {
    return this.action.name === this.toolbarPlugin.EMBEDDED_COMMENTS && this.bpmnModeler.embeddedCommentsActive;
  }

}
