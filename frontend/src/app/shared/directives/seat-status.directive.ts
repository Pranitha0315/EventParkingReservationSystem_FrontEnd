import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[appSeatStatus]', standalone: true })
export class SeatStatusDirective {
  @Input({ required: true }) appSeatStatus = '';
  @HostBinding('class.state-available') get available(): boolean { return this.appSeatStatus.toLowerCase() === 'available'; }
  @HostBinding('class.state-held') get held(): boolean { return this.appSeatStatus.toLowerCase() === 'held'; }
  @HostBinding('class.state-booked') get booked(): boolean { return this.appSeatStatus.toLowerCase() === 'booked'; }
  @HostBinding('class.state-selected') get selected(): boolean { return this.appSeatStatus.toLowerCase() === 'selected'; }
}
