import { computed, Injectable, signal } from '@angular/core';
import { EventItem } from '../models/event.model';
import { ParkingSlot } from '../models/parking.model';
import { Seat } from '../models/seat.model';
import { Seat } from '../models/seat.model';

@Injectable({ providedIn: 'root' })
export class BookingStateService {
    keepAvailableSeats(available: Set<number>) {
        throw new Error('Method not implemented.');
    }
    seats() {
        throw new Error('Method not implemented.');
    }
    toggleSeat(seat: Seat) {
        throw new Error('Method not implemented.');
    }
    clearSeats() {
        throw new Error('Method not implemented.');
    }
    replaceSeats(run: Seat[]) {
        throw new Error('Method not implemented.');
    }
seatCount() {
throw new Error('Method not implemented.');
}
    clearParkingIfUnavailable(available: Set<number>) {
      throw new Error('Method not implemented.');
    }
    parking() {
      throw new Error('Method not implemented.');
    }
    setParking(candidate: ParkingSlot) {
      throw new Error('Method not implemented.');
    }
    setEvent(event: EventItem) {
        throw new Error('Method not implemented.');
    }

}
