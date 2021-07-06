import {Base64} from 'js-base64';

export class CoderHelper {

  public static encode(data: any): string {
    try {
      return Base64.encode(JSON.stringify(data));
    } catch (e) {
      return Base64.encode(data);
    }
  }

  public static decode(str: string): any {
    try {
      return JSON.parse(Base64.decode(str));
    } catch (e) {
      return Base64.decode(str);
    }
  }

}
