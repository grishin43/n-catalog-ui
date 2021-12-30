import {Action, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {CatalogStateModel} from '../models/catalog-state.model';
import {CatalogActions} from '../actions/catalog.actions';
import {patch} from '@ngxs/store/operators';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import ProcessActiveResourceXmlContentPatched = CatalogActions.ProcessActiveResourceXmlContentPatched;

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
  patchCurrentProcessActiveResourceXmlContent(ctx: StateContext<CatalogStateModel>, {content}: ProcessActiveResourceXmlContentPatched)
    : void {
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

}
