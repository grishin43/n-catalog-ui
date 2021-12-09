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

@State<EntityStateModel<ProcessModel>>({
  name: 'npProcesses',
  defaults: defaultEntityState()
})
export class ProcessState extends EntityState<ProcessModel> {
  constructor() {
    super(ProcessState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(ProcessActions.ProcessesFetched)
  processFetched(ctx: StateContext<EntityStateModel<ProcessModel>>, {processes}: ProcessActions.ProcessesFetched): void {

    ctx.dispatch(new CreateOrReplace(ProcessState, processes));
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
