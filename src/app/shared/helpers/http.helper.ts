import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, retryWhen} from 'rxjs/operators';

export namespace NPHttpHelper {

  const defaultMaxRetry = 5;
  export function delayedRetry(delayMs: number, maxRetry = defaultMaxRetry) {
    let retries = maxRetry;

    return (src: Observable<any>) => {
      src.pipe(
        retryWhen((errors: Observable<any>) => errors.pipe(
          delay(delayMs),
          mergeMap(errors => retries -- > 0 ? of(errors) : throwError('max retry number reached'))
        ))
      )
    }
  }
}
