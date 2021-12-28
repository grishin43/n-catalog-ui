import {LocalStorageHelper} from '../../helpers/localStorageHelper';
import {StorageEnum} from '../../models/storageEnum';

export class LocalSaverHelper {

  public static saveResource(folderId: string, processId: string, content: string, generation: number): void {
    const lsResources = LocalStorageHelper.getData(StorageEnum.SAVED_RESOURCES) || [];
    const duplicateIndex = lsResources.findIndex((item) => item.folderId === folderId && item.processId === processId);
    if (duplicateIndex > -1) {
      lsResources.splice(duplicateIndex, 1);
    }
    lsResources.push({folderId, processId, content, generation});
    LocalStorageHelper.setData(StorageEnum.SAVED_RESOURCES, lsResources);
  }

  public static getResource(folderId: string, processId: string): string {
    const lsResources = LocalStorageHelper.getData(StorageEnum.SAVED_RESOURCES) || [];
    const matchResource = lsResources.find((item) => item.folderId === folderId && item.processId === processId);
    return matchResource?.content;
  }

  public static deleteResource(folderId: string, processId: string): void {
    const lsResources = LocalStorageHelper.getData(StorageEnum.SAVED_RESOURCES) || [];
    const duplicateIndex = lsResources.findIndex((item) => item.folderId === folderId && item.processId === processId);
    if (duplicateIndex > -1) {
      lsResources.splice(duplicateIndex, 1);
    }
    LocalStorageHelper.setData(StorageEnum.SAVED_RESOURCES, lsResources);
  }

}
