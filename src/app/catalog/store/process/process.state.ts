import {
  CreateOrReplace,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  Remove, Update
} from '@ngxs-labs/entity-state';
import {CurrentProcessModel} from '../../models/current-process.model';
import {Action, State, StateContext} from '@ngxs/store';
import {ProcessActions} from './process.actions';
import {Injectable} from '@angular/core';
import {ProcessSelectorsHelper} from './process-selectors.helper';

@State<EntityStateModel<CurrentProcessModel>>({
  name: 'npProcesses',
  defaults: defaultEntityState()
})
@Injectable()
export class ProcessState extends EntityState<CurrentProcessModel> {
  constructor() {
    super(ProcessState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(ProcessActions.ProcessesFetched)
  processFetched(ctx: StateContext<EntityStateModel<CurrentProcessModel>>, {processes}: ProcessActions.ProcessesFetched): void {
    ctx.dispatch(new CreateOrReplace(ProcessState, processes));
  }

  @Action(ProcessActions.FolderProcessesFetched)
  folderProcessesFetched(ctx: StateContext<EntityStateModel<CurrentProcessModel>>, {
    processes,
    parentFolderId
  }: ProcessActions.FolderProcessesFetched): void {
    const state = ctx.getState();
    ctx.dispatch(new CreateOrReplace(ProcessState, processes));
    // remove leftovers which doesn't exist
    const recentIds = new Set(processes.map(({id}: CurrentProcessModel) => id));
    const allFoldersProcesses = ProcessSelectorsHelper.filterProcessByFolderId(Object.values(state.entities), parentFolderId);

    const idsToBeCleared = allFoldersProcesses
      .filter(({id}: CurrentProcessModel) => !recentIds.has(id))
      .map(({id}: CurrentProcessModel) => id);

    ctx.dispatch(new Remove(ProcessState, idsToBeCleared));
  }

  @Action(ProcessActions.DraftProcessCreated)
  draftProcessCreated(ctx: StateContext<EntityStateModel<CurrentProcessModel>>, {
    draftProcess,
    correlationId
  }: ProcessActions.DraftProcessCreated): void {
    draftProcess.id = correlationId;
    ctx.dispatch(new CreateOrReplace(ProcessState, [draftProcess]));
  }

  @Action(ProcessActions.ProcessDeleted)
  processDeleted(ctx: StateContext<EntityStateModel<CurrentProcessModel>>, {processId}: ProcessActions.ProcessDeleted): void {
    // const state = ctx.getState();
    // const process = EntitySelector<ProcessModel>(processId)
    ctx.dispatch(new Remove(ProcessState, processId));
  }

  @Action(ProcessActions.ProcessRenamed)
  processRenamed(ctx: StateContext<EntityStateModel<CurrentProcessModel>>, {processId, newName}: ProcessActions.ProcessRenamed): void {
    ctx.dispatch(new Update(ProcessState, [processId], {name: newName}));
  }

}
