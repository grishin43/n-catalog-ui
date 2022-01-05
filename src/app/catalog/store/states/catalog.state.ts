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
          activeResource: patch({
            type: ResourceTypeEnum.XML,
            processId: ctx.getState().currentProcess.id,
            content
          })
        })
      }));
    }
  }

  @Action(CatalogActions.ProcessResourcePatched)
  patchProcessResource(ctx: StateContext<CatalogStateModel>, {content, type}: CatalogActions.ProcessResourcePatched)
    : void {
    const currentProcess = ctx.getState().currentProcess;
    if (currentProcess.resources?.length && currentProcess.activeResource) {
      ctx.setState(patch({
        currentProcess: patch({
          resources: updateItem((r: ResourceModel) => {
            return r.id === currentProcess.activeResource.id && r.type === currentProcess.activeResource.type;
          }, patch({...currentProcess.activeResource, content}))
        })
      }));
    } else {
      ctx.setState(patch({
        currentProcess: patch({
          resources: patch([{
            id: uuid(),
            processId: currentProcess.id,
            type,
            content
          }] as ResourceModel[])
        })
      }));
    }
  }

}
