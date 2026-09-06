import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SeatLabelPipe } from '../../../shared/pipes/seat-label.pipe';
import { SeatStatusDirective } from '../../../shared/directives/seat-status.directive';

@Component({
  selector: 'app-seat-item',
  standalone: true,
  imports: [NgClass, SeatLabelPipe, SeatStatusDirective],
  template: ``
})
export class SeatItemComponent {

}
