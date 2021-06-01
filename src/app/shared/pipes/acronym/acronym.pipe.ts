import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'acronym',
  pure: false
})
export class AcronymPipe implements PipeTransform {
  transform(str: string, wordsCount: number): string {
    if (str) {
      const words = str.split(' ');
      str = '';
      if (wordsCount > words.length) {
        wordsCount = words.length;
      }
      for (let i = 0; i < wordsCount; i++) {
        str += words[i][0];
      }
    }
    return str?.toUpperCase();
  }
}
