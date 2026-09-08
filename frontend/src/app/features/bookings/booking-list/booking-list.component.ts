// import { Component, OnInit, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { BookingService } from '../../../core/services/booking.service';
// import { AuthService } from '../../../core/services/auth.service';
// import { Booking } from '../../../core/models/booking.model';
// import { apiErrorMessage } from '../../../core/utils/api-error';
// import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
// import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
// import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
// import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
// import { BookingStatusPipe } from '../../../shared/pipes/booking-status.pipe';

// @Component({ selector: 'app-booking-list', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, StatusBadgeComponent, BookingStatusPipe], templateUrl: './booking-list.component.html' })
// export class BookingListComponent implements OnInit {
//   private readonly service = inject(BookingService);
//   private readonly auth = inject(AuthService);
//   readonly items = signal<Booking[]>([]);
//   readonly loading = signal(true);
//   readonly error = signal('');

//   ngOnInit(): void { this.load(); }
//   load(): void {
//     const id = this.auth.user()?.userId;
//     if (!id) return;
//     this.loading.set(true); this.error.set('');
//     this.service.getCustomerHistory(id).subscribe({
//       next: items => { this.items.set(items); this.loading.set(false); },
//       error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
//     });
//   }
// }

