import {Action, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {CatalogStateModel} from '../models/catalog-state.model';
import {CatalogActions} from '../actions/catalog.actions';
import {patch, updateItem} from '@ngxs/store/operators';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {ResourceModel} from '../../../models/domain/resource.model';
import {v4 as uuid} from 'uuid';

@State<CatalogStateModel>({
  name: 'catalog',
  defaults: {
    currentProcess: null
  }
})

@Injectable()
export class CatalogState {
  constructor() {
  }

  @Action(CatalogActions.ProcessFetched)
  fetchCurrentProcess(ctx: StateContext<CatalogStateModel>, {currentProcess}: CatalogStateModel): void {
    if (currentProcess?.resources?.length && !currentProcess?.activeResource) {
      currentProcess.activeResource = currentProcess.resources.find((r: ResourceModel) => r.type === ResourceTypeEnum.XML);
    }
    const stateProcess = ctx.getState().currentProcess;
    currentProcess.versions = stateProcess?.versions;
    currentProcess.currentVersionId = stateProcess?.currentVersionId;
    currentProcess.canDiscardChanges = stateProcess?.canDiscardChanges;
    ctx.setState(patch({currentProcess}));
  }

  @Action(CatalogActions.ProcessActiveResourceXmlContentPatched)
  patchCurrentProcessActiveResourceXmlContent(
    ctx: StateContext<CatalogStateModel>,
    {content}: CatalogActions.ProcessActiveResourceXmlContentPatched): void {
    if (ctx.getState().currentProcess?.activeResource) {
      ctx.setState(patch({
        currentProcess: patch({
          activeResource: patch({content})
        })
      }));
    } else {
      ctx.setState(patch({
        currentProcess: patch({
          activeResource: {
            type: ResourceTypeEnum.XML,
            processId: ctx.getState().currentProcess.id,
            content,
            id: uuid()
          }
        })
      }));
    }
  }

  @Action(CatalogActions.ProcessResourcePatched)
  patchProcessResource(ctx: StateContext<CatalogStateModel>, {content, type}: CatalogActions.ProcessResourcePatched)
    : void {
    const currentProcess = ctx.getState().currentProcess;
    const activeResource = currentProcess.activeResource;
    if (currentProcess.resources?.length && activeResource) {
      ctx.setState(patch({
        currentProcess: patch({
          resources: updateItem((resource: ResourceModel) => {
            return resource.id === activeResource.id && resource.type === activeResource.type;
          }, patch({content}))
        })
      }));
    } else {
      ctx.setState(patch({
        currentProcess: patch({
          resources: [activeResource]
        })
      }));
    }
  }

  @Action(CatalogActions.ProcessGenerationPatched)
  patchProcessGeneration(ctx: StateContext<CatalogStateModel>, {generation}: CatalogActions.ProcessGenerationPatched): void {
    if (generation) {
      ctx.setState(patch({
        currentProcess: patch({generation})
      }));
    }
  }

  @Action(CatalogActions.ProcessVersionsPatched)
  patchProcessVersionsAvailability(ctx: StateContext<CatalogStateModel>, {versions}: CatalogActions.ProcessVersionsPatched)
    : void {
    ctx.setState(patch({
      currentProcess: patch({versions})
    }));
  }

  @Action(CatalogActions.ProcessVersionOpened)
  openProcessVersion(ctx: StateContext<CatalogStateModel>, {currentVersionId}: CatalogActions.ProcessVersionOpened)
    : void {
    ctx.setState(patch({
      currentProcess: patch({currentVersionId})
    }));
  }

  @Action(CatalogActions.ProcessDiscardChangesPatched)
  processDiscardChangesPatched(ctx: StateContext<CatalogStateModel>, {flag}: CatalogActions.ProcessDiscardChangesPatched)
    : void {
    const hasVersions = !!ctx.getState().currentProcess?.versions?.length;
    ctx.setState(patch({
      currentProcess: patch({canDiscardChanges: hasVersions && flag})
    }));
  }

  @Action(CatalogActions.ProcessNameChanged)
  changeProcessName(ctx: StateContext<CatalogStateModel>, {name}: CatalogActions.ProcessNameChanged)
    : void {
    ctx.setState(patch({
      currentProcess: patch({name})
    }));
  }

}
