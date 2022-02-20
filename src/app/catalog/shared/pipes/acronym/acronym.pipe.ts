import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'acronym',
  pure: false
})
export class AcronymPipe implements PipeTransform {
  transform(str: string, lettersCount: number): string {
    if (str) {
      const letters = str.split(' ');
      str = '';
      if (lettersCount > letters.length) {
        lettersCount = letters.length;
      }
      for (let i = 0; i < lettersCount; i++) {
        str += letters[i][0];
      }
    }
    return str?.toUpperCase();
  }
}
