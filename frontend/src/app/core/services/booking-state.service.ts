import { computed, Injectable, signal } from '@angular/core';
import { EventItem } from '../models/event.model';
import { ParkingSlot } from '../models/parking.model';
import { Seat } from '../models/seat.model';

@Injectable({ providedIn: 'root' })
export class BookingStateService {
  private readonly eventSignal = signal<EventItem | null>(null);
  private readonly seatsSignal = signal<Seat[]>([]);
  private readonly parkingSignal = signal<ParkingSlot | null>(null);

  readonly event = this.eventSignal.asReadonly();
  readonly seats = this.seatsSignal.asReadonly();
  readonly parking = this.parkingSignal.asReadonly();
  readonly seatTotal = computed(() => this.seatsSignal().reduce((sum, seat) => sum + seat.price, 0));
  readonly total = computed(() => this.seatTotal() + (this.parkingSignal()?.fee ?? 0));
  readonly seatCount = computed(() => this.seatsSignal().length);

  setEvent(event: EventItem): void {
    if (this.eventSignal()?.eventId !== event.eventId) {
      this.eventSignal.set(event);
      this.seatsSignal.set([]);
      this.parkingSignal.set(null);
    } else {
      this.eventSignal.set(event);
    }
  }

  toggleSeat(seat: Seat): void {
    if (seat.status !== 'Available') return;
    this.seatsSignal.update(current => current.some(x => x.seatId === seat.seatId)
      ? current.filter(x => x.seatId !== seat.seatId)
      : [...current, seat]);
  }

  replaceSeats(seats: Seat[]): void {
    this.seatsSignal.set(seats.filter(seat => seat.status === 'Available'));
  }

  clearSeats(): void {
    this.seatsSignal.set([]);
  }

  setParking(slot: ParkingSlot | null): void {
    if (slot && slot.status !== 'Available') return;
    this.parkingSignal.set(slot);
  }

  keepAvailableSeats(availableIds: Set<number>): void {
    this.seatsSignal.update(current => current.filter(x => availableIds.has(x.seatId)));
  }

  clearParkingIfUnavailable(availableIds: Set<number>): void {
    const current = this.parkingSignal();
    if (current && !availableIds.has(current.parkingSlotId)) this.parkingSignal.set(null);
  }

  clear(): void {
    this.eventSignal.set(null);
    this.seatsSignal.set([]);
    this.parkingSignal.set(null);
  }
}
