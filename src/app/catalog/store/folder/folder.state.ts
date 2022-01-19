import {
  CreateOrReplace,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy, Remove,
  Update
} from '@ngxs-labs/entity-state';
import {FolderModel} from '../../../models/domain/folder.model';
import {Action, State, StateContext} from '@ngxs/store';
import {FolderActions} from './folder.actions';
import {Injectable} from '@angular/core';
import {FoldersSelectorsHelper} from './folders-selectors.helper';

@State<EntityStateModel<FolderModel>>({
  name: 'npFolders',
  defaults: defaultEntityState()
})
@Injectable()
export class FolderState extends EntityState<FolderModel> {
  constructor() {
    super(FolderState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(FolderActions.FoldersFetched)
  folderFetched(ctx: StateContext<EntityStateModel<FolderModel>>, {folders}: FolderActions.FoldersFetched): void {
    ctx.dispatch(new CreateOrReplace(FolderState, folders));
  }

  @Action(FolderActions.SubFolderFetched)
  subFolderFetched(ctx: StateContext<EntityStateModel<FolderModel>>, {folders, parentFolderId}: FolderActions.SubFolderFetched): void {
    const state = ctx.getState();
    // update folders received from the server
    ctx.dispatch(new CreateOrReplace(FolderState, folders));
    // remove leftovers which doesn't exist
    const recentIds = new Set(folders.map(({id}: FolderModel) => id));
    const allSubFolders = FoldersSelectorsHelper.filterFoldersByFolderId(Object.values(state.entities), parentFolderId);
    const idsToBeCleared = allSubFolders
      .filter(({id}: FolderModel) => !recentIds.has(id))
      .map(({id}: FolderModel) => id);

    ctx.dispatch(new Remove(FolderState, idsToBeCleared));
  }

  @Action(FolderActions.FolderRenamed)
  folderRenamed(ctx: StateContext<EntityStateModel<FolderModel>>, {folderId, folderName}: FolderActions.FolderRenamed): void {
    ctx.dispatch(new Update(FolderState, [folderId], {name: folderName}));
  }

  @Action(FolderActions.FolderMarkedToBeDeleted)
  folderMarkToBeDeleted(ctx: StateContext<EntityStateModel<FolderModel>>, {folderId}: FolderActions.FolderMarkedToBeDeleted): void {
    ctx.dispatch(new Update(FolderState, [folderId], {toBeDeleted: true}));
  }

  @Action(FolderActions.FolderRevertToBeDeleted)
  folderRevertToBeDeleted(ctx: StateContext<EntityStateModel<FolderModel>>, {folderId}: FolderActions.FolderRevertToBeDeleted): void {
    ctx.dispatch(new Update(FolderState, [folderId], {toBeDeleted: false}));
  }

  @Action(FolderActions.FolderDeleted)
  folderDeleted(ctx: StateContext<EntityStateModel<FolderModel>>, {folderId}: FolderActions.FolderDeleted): void {
    ctx.dispatch(new Remove(FolderState, [folderId]));
  }
}
