// import { Component, OnInit, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { EventService } from '../../../core/services/event.service';
// import { BookingService } from '../../../core/services/booking.service';
// import { EventItem } from '../../../core/models/event.model';
// import { Booking } from '../../../core/models/booking.model';
// import { apiErrorMessage } from '../../../core/utils/api-error';
// import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
// import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
// import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
// import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

// @Component({
//   selector: 'app-admin-bookings',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ErrorMessageComponent, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
//   templateUrl: './admin-bookings.component.html'
// })
// export class AdminBookingsComponent implements OnInit {
//   private readonly eventsService = inject(EventService);
//   private readonly bookingsService = inject(BookingService);

//   readonly events = signal<EventItem[]>([]);
//   readonly bookings = signal<Booking[]>([]);
//   readonly loading = signal(false);
//   readonly error = signal('');
//   readonly success = signal('');
//   readonly cancelOpen = signal(false);
//   readonly cancelling = signal(false);
//   readonly reasonError = signal('');

//   readonly cancellationTemplates = [
//     'Event cancelled by organizer',
//     'Event schedule changed',
//     'Venue unavailable',
//     'Booking/payment issue',
//     'Other operational reason'
//   ];

//   eventId = 0;
//   selected: Booking | null = null;
//   cancellationReason = '';

//   ngOnInit(): void {
//     this.eventsService.getAll().subscribe({
//       next: items => {
//         this.events.set(items);
//         if (items.length) {
//           this.eventId = items[0].eventId;
//           this.load();
//         }
//       },
//       error: error => this.error.set(apiErrorMessage(error))
//     });
//   }

//   load(): void {
//     if (!this.eventId) { this.bookings.set([]); return; }
//     this.loading.set(true);
//     this.error.set('');
//     this.bookingsService.getByEvent(this.eventId).subscribe({
//       next: items => { this.bookings.set(items); this.loading.set(false); },
//       error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
//     });
//   }

//   askCancel(booking: Booking): void {
//     this.selected = booking;
//     this.cancellationReason = '';
//     this.reasonError.set('');
//     this.cancelOpen.set(true);
//   }

//   useReason(reason: string): void {
//     this.cancellationReason = reason;
//     this.reasonError.set('');
//   }

//   closeCancel(): void {
//     if (this.cancelling()) return;
//     this.cancelOpen.set(false);
//     this.selected = null;
//     this.cancellationReason = '';
//     this.reasonError.set('');
//   }

//   cancel(): void {
//     const booking = this.selected;
//     const reason = this.cancellationReason.trim();
//     if (!booking || this.cancelling()) return;
//     if (reason.length < 5) {
//       this.reasonError.set('Enter a clear cancellation reason with at least 5 characters.');
//       return;
//     }

//     this.cancelling.set(true);
//     this.error.set('');
//     this.success.set('');
//     this.bookingsService.cancel(booking.bookingId, reason).subscribe({
//       next: result => {
//         this.cancelling.set(false);
//         this.cancelOpen.set(false);
//         this.success.set(`${result.message} Reason included for the customer notification: “${reason}”`);
//         this.selected = null;
//         this.cancellationReason = '';
//         this.load();
//       },
//       error: error => {
//         this.cancelling.set(false);
//         this.error.set(apiErrorMessage(error));
//       }
//     });
//   }
// }
