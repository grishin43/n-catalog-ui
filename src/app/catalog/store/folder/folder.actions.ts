import {FolderModel} from '../../../models/domain/folder.model';

export namespace FolderActions {
  export class FoldersFetched {
      static readonly type = '[CatalogService] FoldersFetched';
      constructor(public folders: FolderModel[]) {}
  }
}
