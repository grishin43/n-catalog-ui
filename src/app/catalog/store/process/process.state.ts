import {
  CreateOrReplace,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  Remove, Update
} from '@ngxs-labs/entity-state';
import {ProcessModel} from '../../../models/domain/process.model';
import {Action, State, StateContext} from '@ngxs/store';
import {ProcessActions} from './process.actions';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {Injectable} from '@angular/core';
import {MapHelper} from '../../helpers/map.helper';

@State<EntityStateModel<ProcessModel>>({
  name: 'npProcesses',
  defaults: defaultEntityState()
})
@Injectable()
export class ProcessState extends EntityState<ProcessModel> {
  constructor() {
    super(ProcessState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(ProcessActions.ProcessesFetched)
  processFetched(ctx: StateContext<EntityStateModel<ProcessModel>>, {processes}: ProcessActions.ProcessesFetched): void {
    ctx.dispatch(new CreateOrReplace(ProcessState, processes));
  }

  @Action(ProcessActions.FolderProcessesFetched)
  folderProcessesFetched(ctx: StateContext<EntityStateModel<ProcessModel>>, {
    processes,
    parentFolderId
  }: ProcessActions.FolderProcessesFetched): void {
    const state = ctx.getState();
    ctx.dispatch(new CreateOrReplace(ProcessState, processes));
    // remove leftovers which doesn't exist
    const recentIds = new Set(processes.map(({id}: ProcessModel) => id));
    const allFoldersProcesses = MapHelper.filterProcessesToEntity(Object.values(state.entities), parentFolderId);
    const idsToBeCleared = allFoldersProcesses
      .filter(({id}: CatalogEntityModel) => !recentIds.has(id))
      .map(({id}: CatalogEntityModel) => id);
    ctx.dispatch(new Remove(ProcessState, idsToBeCleared));
  }

  @Action(ProcessActions.DraftProcessCreated)
  draftProcessCreated(ctx: StateContext<EntityStateModel<ProcessModel>>, {
    draftProcess,
    correlationId
  }: ProcessActions.DraftProcessCreated): void {
    draftProcess.id = correlationId;
    ctx.dispatch(new CreateOrReplace(ProcessState, [draftProcess]));
  }

  @Action(ProcessActions.ProcessDeleted)
  processDeleted(ctx: StateContext<EntityStateModel<ProcessModel>>, {processId}: ProcessActions.ProcessDeleted): void {
    // const state = ctx.getState();
    // const process = EntitySelector<ProcessModel>(processId)
    ctx.dispatch(new Remove(ProcessState, processId));
  }

  @Action(ProcessActions.ProcessRenamed)
  processRenamed(ctx: StateContext<EntityStateModel<ProcessModel>>, {processId, newName}: ProcessActions.ProcessRenamed): void {
    ctx.dispatch(new Update(ProcessState, [processId], {name: newName}));
  }

}
