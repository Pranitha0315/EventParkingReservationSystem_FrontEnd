import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { SeatService } from '../../core/services/seat.service';
import { ParkingService } from '../../core/services/parking.service';
import { apiErrorMessage } from '../../core/utils/api-error';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SeatLabelPipe } from '../../shared/pipes/seat-label.pipe';
import { SlotCodePipe } from '../../shared/pipes/slot-code.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ErrorMessageComponent, ConfirmDialogComponent, SeatLabelPipe, SlotCodePipe],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly bookings = inject(BookingService);
  private readonly seatsService = inject(SeatService);
  private readonly parkingService = inject(ParkingService);
  private readonly router = inject(Router);
  readonly state = inject(BookingStateService);

  readonly attendeeControls = this.fb.array<FormControl<string>>([]);
  readonly form = this.fb.group({ attendees: this.attendeeControls });
  readonly loading = signal(false);
  readonly error = signal('');
  readonly confirmOpen = signal(false);

  ngOnInit(): void {
    this.rebuildAttendees();
  }

  openConfirm(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.state.event() || this.state.seatCount() === 0) return;
    this.confirmOpen.set(true);
  }

  createBooking(): void {
    const event = this.state.event();
    if (!event || this.loading()) return;
    this.confirmOpen.set(false);
    this.loading.set(true);
    this.error.set('');
    this.bookings.create({
      eventId: event.eventId,
      seatIds: this.state.seats().map(x => x.seatId),
      parkingSlotId: this.state.parking()?.parkingSlotId ?? null
    }).subscribe({
      next: booking => {
        this.loading.set(false);
        this.state.clear();
        void this.router.navigate(['/bookings', booking.bookingId]);
      },
      error: error => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error));
        if (error instanceof HttpErrorResponse && error.status === 409) this.resolveConflict(event.eventId);
      }
    });
  }

  private rebuildAttendees(): void {
    this.attendeeControls.clear();
    this.state.seats().forEach((_, index) => this.attendeeControls.push(
      this.fb.control(`Attendee ${index + 1}`, [Validators.required, Validators.minLength(2), Validators.maxLength(100)])
    ));
  }

  private resolveConflict(eventId: number): void {
    forkJoin({ seats: this.seatsService.getMap(eventId), parking: this.parkingService.getLayout(eventId) }).subscribe({
      next: data => {
        this.state.keepAvailableSeats(new Set(data.seats.filter(x => x.status === 'Available').map(x => x.seatId)));
        this.state.clearParkingIfUnavailable(new Set(data.parking.filter(x => x.status === 'Available').map(x => x.parkingSlotId)));
        this.rebuildAttendees();
        this.error.set(`${this.error()} Availability was refreshed and unavailable selections were removed.`);
      },
      error: () => undefined
    });
  }
}
