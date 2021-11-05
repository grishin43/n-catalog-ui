import {Component, Input} from '@angular/core';
import {ToolbarItemModel} from '../../../../models/toolbar/toolbar-item.model';
import {BpmnModelerService} from '../../../../services/bpmn-modeler/bpmn-modeler.service';
import {BpmnToolbarService} from '../../../../services/bpmn-toolbar/bpmn-toolbar.service';
import {ToolbarBlockerModel} from '../../../../models/toolbar/toolbar-blocker.model';
import {ToolbarPluginEnum} from '../../../../models/toolbar/toolbar-plugin.enum';
import {ProcessModel} from '../../../../../models/domain/process.model';

@Component({
  selector: 'np-toolbar-action-btn',
  templateUrl: './toolbar-action-btn.component.html',
  styleUrls: ['./toolbar-action-btn.component.scss']
})
export class ToolbarActionBtnComponent {
  @Input() action: ToolbarItemModel;
  @Input() process: ProcessModel;

  public toolbarPlugin = ToolbarPluginEnum;

  constructor(
    public bpmnModeler: BpmnModelerService,
    private bpmnToolbar: BpmnToolbarService
  ) {
  }

  public get disabled(): boolean {
    const match: ToolbarBlockerModel = this.bpmnToolbar.blockers.find((blocker: ToolbarBlockerModel) => {
      return blocker.name === this.action.name;
    });
    return match && !match.allow;
  }

  public get showTick(): boolean {
    return this.isTransactionBoundariesAndActive || this.isTokenSimulationAndActive || this.isSchemeValidatorAndActive || this.isEmbeddedCommentsAndActive;
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
