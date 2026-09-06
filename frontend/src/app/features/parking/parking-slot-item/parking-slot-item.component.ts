import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SlotCodePipe } from '../../../shared/pipes/slot-code.pipe';

@Component({
  selector: 'app-parking-slot-item',
  standalone: true,
  imports: [NgClass, SlotCodePipe],
  template: ``
})
export class ParkingSlotItemComponent {
  
}
