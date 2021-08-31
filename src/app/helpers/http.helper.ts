import {HttpStatusCodeEnum} from '../models/http-status-code.enum';

export class HttpHelper {

  public static get http5xxStatuses(): HttpStatusCodeEnum[] {
    return [
      HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      HttpStatusCodeEnum.NOT_IMPLEMENTED,
      HttpStatusCodeEnum.BAD_GATEWAY,
      HttpStatusCodeEnum.SERVICE_UNAVAILABLE,
      HttpStatusCodeEnum.GATEWAY_TIMEOUT,
      HttpStatusCodeEnum.HTTP_VERSION_NOT_SUPPORTED
    ];
  }

}
