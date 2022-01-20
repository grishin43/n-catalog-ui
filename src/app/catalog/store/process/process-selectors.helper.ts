import {CurrentProcessModel} from '../../models/current-process.model';

export class ProcessSelectorsHelper {
  static filterProcessByFolderId(entities: CurrentProcessModel[], folderId: string) {
    return entities.filter((process: CurrentProcessModel) => {
      return process.parent.id === folderId;
    })
  }
}
