import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParkingSlot } from '../../../core/models/parking.model';
import { SlotCodePipe } from '../../../shared/pipes/slot-code.pipe';

@Component({
  selector: 'app-parking-slot-item',
  standalone: true,
  imports: [NgClass, SlotCodePipe],
  template: ``
})
export class ParkingSlotItemComponent {
  @Input({ required: true }) slot!: ParkingSlot;
  @Input() selected = false;
  @Output() chosen = new EventEmitter<ParkingSlot>();
  get ariaLabel(): string { return `Parking ${this.slot?.slotNumber}, ${this.selected ? 'selected' : this.slot?.status}`; }
}
