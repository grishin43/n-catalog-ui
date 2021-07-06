import {CookieEnum} from '../models/cookie.enum';
import {Cookie} from 'ng2-cookies';
import {CoderHelper} from './coder.helper';

export class CookieHelper {

  public static setCookie(key: CookieEnum, value: any): void {
    Cookie.set(CoderHelper.encode(key), CoderHelper.encode(value));
  }

  public static getCookie(key: CookieEnum): any {
    return CoderHelper.decode(Cookie.get(CoderHelper.encode(key)));
  }

  public static deleteCookie(key: CookieEnum): void {
    Cookie.delete(CoderHelper.encode(key));
  }

}
