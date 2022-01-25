import {FolderModel} from '../../../models/domain/folder.model';

export namespace FolderActions {
  export class FoldersFetched {
      static readonly type = '[CatalogService] FoldersFetched';
      constructor(public folders: FolderModel[]) {}
  }

  export class SubFolderFetched {
      static readonly type = '[FolderService] SubFolderFetched';
      constructor(public folders: FolderModel[], public parentFolderId: string) {}
  }

  export class FolderRenamed {
      static readonly type = '[FolderService] FolderRenamed';
      constructor(public folderId: string, public folderName: string) {}
  }

  export class FolderMarkedToBeDeleted {
      static readonly type = 'FolderMarkedToBeDeleted';
      constructor(public folderId: string) {}
  }

  export class FolderRevertToBeDeleted {
      static readonly type = 'FolderRevertToBeDeleted';
      constructor(public folderId: string) {}
  }

  export class FolderDeleted {
      static readonly type = 'FolderDeleted';
      constructor(public folderId: string) {}
  }
}
