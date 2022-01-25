import {FolderModel} from '../../../models/domain/folder.model';

export class FoldersSelectorsHelper {
  public static filterFoldersByFolderId(entities: FolderModel[], parentFolderId): FolderModel[] {
    return entities.filter((folder: FolderModel) => {
      // hide folders witch have to be deleted
      return !folder.toBeDeleted && folder.parent?.id === parentFolderId;
    });
  }
}
