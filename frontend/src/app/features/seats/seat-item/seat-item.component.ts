import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SeatLabelPipe } from '../../../shared/pipes/seat-label.pipe';
import { SeatStatusDirective } from '../../../shared/directives/seat-status.directive';
import { Seat } from '../../../core/models/seat.model';

@Component({
  selector: 'app-seat-item',
  standalone: true,
  imports: [NgClass, SeatLabelPipe, SeatStatusDirective],
  template: `<button type="button" class="seat-button" [appSeatStatus]="displayStatus" [ngClass]="{ selected: selected, blocked: seat.status !== 'Available' }" [disabled]="seat.status !== 'Available'" [attr.aria-label]="ariaLabel" (click)="chosen.emit(seat)">{{ seat.seatNumber | seatLabel }}<span class="sub">{{ selected ? 'Selected' : seat.status }}</span></button>`
})
export class SeatItemComponent {
 @Input({ required: true }) seat!: Seat;
  @Input() selected = false;
  @Output() chosen = new EventEmitter<Seat>();
  get displayStatus(): string { return this.selected ? 'Selected' : this.seat?.status ?? ''; }
  get ariaLabel(): string { return `Seat ${this.seat?.seatNumber}, ${this.selected ? 'selected' : this.seat?.status}`; }
}
