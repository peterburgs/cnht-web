import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'duration' })
export class Duration implements PipeTransform {
  transform(value: number): string {
    if (value < 0 || !value) {
      return 'No video uploaded';
    }
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60).toString().padStart(2, '0');
  }
}
