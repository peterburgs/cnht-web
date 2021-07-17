import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',

})
export class Truncate implements PipeTransform {
  transform(value: string, limit = 80, completeWords = true, ellipsis = '...') {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}