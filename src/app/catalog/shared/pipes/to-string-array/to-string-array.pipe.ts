import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toStringArray',
  pure: false
})
export class ToStringArrayPipe implements PipeTransform {
  transform(value: any[], key: string): string[] {
    return value?.map((item: any): string => (item[key]));
  }
}
