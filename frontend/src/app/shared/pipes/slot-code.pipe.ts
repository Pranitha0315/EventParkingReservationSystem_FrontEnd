import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'slotCode', standalone: true })
export class SlotCodePipe implements PipeTransform {
  transform(value: string, zone?: string | null): string { return zone ? `${zone}-${value}` : value; }
}
