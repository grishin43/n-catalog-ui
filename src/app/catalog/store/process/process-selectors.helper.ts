import {ProcessModel} from '../../../models/domain/process.model';

export class ProcessSelectorsHelper {
  public static filterProcessByFolderId(entities: ProcessModel[], folderId: string): ProcessModel[] {
    return entities.filter((process: ProcessModel) => {
      // hide processes witch have to be deleted
      return !process.toBeDeleted && process.parent.id === folderId;
    });
  }
}
