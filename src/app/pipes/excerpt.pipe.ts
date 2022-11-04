import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt',
  standalone: true,
})
export class ExcerptPipe implements PipeTransform {
  transform(text: string | undefined, limit?: number) {
    if (!text) return null;

    let desiredLimit = limit ? limit : 100;

    return text.substring(0, desiredLimit) + '...';
  }
}
