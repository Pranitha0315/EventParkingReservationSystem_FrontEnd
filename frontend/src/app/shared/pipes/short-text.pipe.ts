import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortText', standalone: true })
export class ShortTextPipe implements PipeTransform {
  transform(value: string, limit = 80): string { return value.length > limit ? `${value.slice(0, limit).trim()}…` : value; }
}
