import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { SeatService } from '../../../core/services/seat.service';
import { ParkingService } from '../../../core/services/parking.service';
import { EventItem } from '../../../core/models/event.model';
import { Seat } from '../../../core/models/seat.model';
import { ParkingSlot } from '../../../core/models/parking.model';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({ selector: 'app-admin-layouts', standalone: true, imports: [CommonModule, FormsModule, ErrorMessageComponent, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent], templateUrl: './admin-layouts.component.html' })
export class AdminLayoutsComponent implements OnInit {
  private readonly eventsService = inject(EventService);
  private readonly seatsService = inject(SeatService);
  private readonly parkingService = inject(ParkingService);
  readonly events = signal<EventItem[]>([]);
  readonly seats = signal<Seat[]>([]);
  readonly slots = signal<ParkingSlot[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  eventId = 0;
  seatMap = { rows: 4, columns: 5, seatType: 'Standard', seatPrice: null as number | null };
  parkingMap = { slotCount: 10, prefix: 'P', zone: 'A', fee: 300 };
  editingSeat: Seat | null = null;
  seatEdit = { seatNumber: '', seatType: '' as string | null, seatPrice: null as number | null };
  editingSlot: ParkingSlot | null = null;
  slotEdit = { slotNumber: '', zone: '' as string | null, eventParkingFee: null as number | null };

  ngOnInit(): void {
    this.eventsService.getAll().subscribe({ next: items => { this.events.set(items); if (items.length) { this.eventId = items[0].eventId; this.loadLayouts(); } }, error: error => this.error.set(apiErrorMessage(error)) });
  }

  loadLayouts(): void {
    if (!this.eventId) { this.seats.set([]); this.slots.set([]); return; }
    this.loading.set(true); this.error.set(''); this.editingSeat = null; this.editingSlot = null;
    forkJoin({ seats: this.seatsService.getMap(this.eventId), slots: this.parkingService.getLayout(this.eventId) }).subscribe({
      next: data => { this.seats.set(data.seats); this.slots.set(data.slots); this.loading.set(false); },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }

  seatOccupancy(): number {
    const total = this.seats().length;
    if (!total) return 0;
    const unavailable = this.seats().filter(x => x.status !== 'Available').length;
    return Math.round((unavailable / total) * 100);
  }

  parkingOccupancy(): number {
    const total = this.slots().length;
    if (!total) return 0;
    const unavailable = this.slots().filter(x => x.status !== 'Available').length;
    return Math.round((unavailable / total) * 100);
  }

  createSeats(form: NgForm): void {
    if (form.invalid || !this.eventId) return;
    this.error.set(''); this.success.set('');
    this.seatsService.createMap(this.eventId, this.seatMap).subscribe({ next: items => { this.seats.set(items); this.success.set('Seat map created.'); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
  createParking(form: NgForm): void {
    if (form.invalid || !this.eventId) return;
    this.error.set(''); this.success.set('');
    this.parkingService.createLayout(this.eventId, this.parkingMap).subscribe({ next: items => { this.slots.set(items); this.success.set('Parking layout created.'); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
  selectSeat(seat: Seat): void { this.editingSeat = seat; this.seatEdit = { seatNumber: seat.seatNumber, seatType: seat.seatType, seatPrice: seat.price }; }
  saveSeat(form: NgForm): void {
    if (!this.editingSeat || form.invalid) return;
    this.seatsService.update(this.eventId, this.editingSeat.seatId, this.seatEdit).subscribe({ next: () => { this.success.set('Seat updated.'); this.loadLayouts(); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
  deleteSeat(seat: Seat): void {
    if (!confirm(`Delete seat ${seat.seatNumber}?`)) return;
    this.seatsService.delete(this.eventId, seat.seatId).subscribe({ next: result => { this.success.set(result.message); this.loadLayouts(); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
  selectSlot(slot: ParkingSlot): void { this.editingSlot = slot; this.slotEdit = { slotNumber: slot.slotNumber, zone: slot.zone, eventParkingFee: slot.fee }; }
  saveSlot(form: NgForm): void {
    if (!this.editingSlot || form.invalid) return;
    this.parkingService.update(this.eventId, this.editingSlot.parkingSlotId, this.slotEdit).subscribe({ next: () => { this.success.set('Parking slot updated.'); this.loadLayouts(); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
  deleteSlot(slot: ParkingSlot): void {
    if (!confirm(`Delete parking slot ${slot.slotNumber}?`)) return;
    this.parkingService.delete(this.eventId, slot.parkingSlotId).subscribe({ next: result => { this.success.set(result.message); this.loadLayouts(); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
}
