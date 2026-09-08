// import { Component, OnInit, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { forkJoin } from 'rxjs';
// import { BookingService } from '../../../core/services/booking.service';
// import { Booking, HoldStatus } from '../../../core/models/booking.model';
// import { apiErrorMessage } from '../../../core/utils/api-error';
// import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
// import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
// import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
// import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
// import { SeatLabelPipe } from '../../../shared/pipes/seat-label.pipe';
// import { BookingStatusPipe } from '../../../shared/pipes/booking-status.pipe';

// @Component({ selector: 'app-booking-detail', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, StatusBadgeComponent, ConfirmDialogComponent, SeatLabelPipe, BookingStatusPipe], templateUrl: './booking-detail.component.html' })
// export class BookingDetailComponent implements OnInit {
//   private readonly route = inject(ActivatedRoute);
//   private readonly service = inject(BookingService);
//   readonly booking = signal<Booking | null>(null);
//   readonly hold = signal<HoldStatus | null>(null);
//   readonly loading = signal(true);
//   readonly error = signal('');
//   readonly success = signal('');
//   readonly confirmOpen = signal(false);
//   bookingId = 0;

//   ngOnInit(): void { this.bookingId = Number(this.route.snapshot.paramMap.get('id')); this.load(); }
//   load(): void {
//     this.loading.set(true); this.error.set('');
//     forkJoin({ booking: this.service.get(this.bookingId), hold: this.service.getHoldStatus(this.bookingId) }).subscribe({
//       next: data => { this.booking.set(data.booking); this.hold.set(data.hold); this.loading.set(false); },
//       error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
//     });
//   }
//   cancel(): void {
//     this.confirmOpen.set(false);
//     this.service.cancel(this.bookingId).subscribe({
//       next: result => { this.success.set(result.message); this.load(); },
//       error: error => this.error.set(apiErrorMessage(error))
//     });
//   }
// }
