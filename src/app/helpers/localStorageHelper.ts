import {StorageEnum} from '../models/storageEnum';
import {CoderHelper} from './coder.helper';

export class LocalStorageHelper {

  public static setData(key: StorageEnum, value: any): void {
    localStorage.setItem(CoderHelper.encode(key), CoderHelper.encode(value));
  }

  public static getData(key: StorageEnum): any {
    try {
      return CoderHelper.decode(localStorage.getItem(CoderHelper.encode(key)));
    } catch (e) {
      return [];
    }
  }

  public static deleteData(key: StorageEnum): void {
    localStorage.removeItem(CoderHelper.encode(key));
  }

}
