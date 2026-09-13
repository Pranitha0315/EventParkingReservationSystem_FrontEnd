import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'seatLabel', standalone: true })
export class SeatLabelPipe implements PipeTransform {
  transform(value: string): string {
    const match = /^([A-Za-z]+)-?(\d+)$/.exec(value ?? '');
    return match ? `${match[1].toUpperCase()}-${match[2]}` : value;
  }
}
