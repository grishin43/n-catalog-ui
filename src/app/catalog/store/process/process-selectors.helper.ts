import {ProcessModel} from '../../../models/domain/process.model';

export class ProcessSelectorsHelper {
  static filterProcessByFolderId(entities: ProcessModel[], folderId: string) {
    return entities.filter((process: ProcessModel) => {
      return process.parent.id === folderId;
    })
  }
}
