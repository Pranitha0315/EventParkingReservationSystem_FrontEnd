import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParkingSlot } from '../../../core/models/parking.model';
import { SlotCodePipe } from '../../../shared/pipes/slot-code.pipe';

@Component({
  selector: 'app-parking-slot-item',
  standalone: true,
  imports: [NgClass, SlotCodePipe],
  template: `<button type="button" class="slot-button" [ngClass]="{ selected: selected, blocked: slot.status !== 'Available' }" [disabled]="slot.status !== 'Available'" [attr.aria-label]="ariaLabel" (click)="chosen.emit(slot)">{{ slot.slotNumber | slotCode:slot.zone }}<span class="sub">{{ selected ? 'Selected' : slot.status }}</span></button>`
})
export class ParkingSlotItemComponent {
  @Input({ required: true }) slot!: ParkingSlot;
  @Input() selected = false;
  @Output() chosen = new EventEmitter<ParkingSlot>();
  get ariaLabel(): string { return `Parking ${this.slot?.slotNumber}, ${this.selected ? 'selected' : this.slot?.status}`; }
}
