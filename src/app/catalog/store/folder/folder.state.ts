import {CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy} from '@ngxs-labs/entity-state';
import {FolderModel} from '../../../models/domain/folder.model';
import {Action, State, StateContext} from '@ngxs/store';
import {FolderActions} from './folder.actions';

@State<EntityStateModel<FolderModel>>({
  name: 'npFolders',
  defaults: defaultEntityState()
})
export class FolderState extends EntityState<FolderModel> {
  constructor() {
    super(FolderState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(FolderActions.FoldersFetched)
  folderFetched(ctx: StateContext<EntityStateModel<FolderModel>>, {folders}: FolderActions.FoldersFetched): void {
      const state = ctx.getState();

      ctx.dispatch(new CreateOrReplace(FolderState, folders));
  }
}
