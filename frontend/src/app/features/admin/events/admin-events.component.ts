import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { VenueService } from '../../../core/services/venue.service';
// import { CategoryService } from '../../../core/services/category.service';
import { BookingService } from '../../../core/services/booking.service';
import { EventItem } from '../../../core/models/event.model';
import { Venue } from '../../../core/models/venue.model';
import { EventCategory } from '../../../core/models/category.model';
import { futureDateValidator } from '../../../core/validators/form.validators';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './admin-events.component.html'
})
export class AdminEventsComponent implements OnInit {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly eventsService = inject(EventService);
  private readonly venuesService = inject(VenueService);
  // private readonly categoriesService = inject(CategoryService);
  private readonly bookingsService = inject(BookingService);

  readonly events = signal<EventItem[]>([]);
  readonly venues = signal<Venue[]>([]);
  readonly categories = signal<EventCategory[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly confirmOpen = signal(false);
  readonly priceLocked = signal(false);
  editingId: number | null = null;
  deleting: EventItem | null = null;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    venueId: [0, [Validators.required, Validators.min(1)]],
    eventCategoryId: [0, [Validators.required, Validators.min(1)]],
    eventDate: ['', [Validators.required, futureDateValidator]],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    ticketPrice: [0, [Validators.required, Validators.min(0)]],
    capacity: [1, [Validators.required, Validators.min(1)]],
    parkingFee: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    // forkJoin({ venues: this.venuesService.getAll(), categories: this.categoriesService.getAll() }).subscribe({
    //   next: data => { this.venues.set(data.venues); this.categories.set(data.categories); },
    //   error: error => this.error.set(apiErrorMessage(error))
    // });
    // this.load();
  }

  load(): void {
    this.loading.set(true); this.error.set('');
    this.eventsService.getAll().subscribe({
      next: items => { this.events.set(items); this.loading.set(false); },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }

  edit(item: EventItem): void {
    this.editingId = item.eventId;
    this.priceLocked.set(false);
    this.form.controls.ticketPrice.enable({ emitEvent: false });
    this.form.setValue({
      name: item.name,
      venueId: item.venueId,
      eventCategoryId: item.eventCategoryId,
      eventDate: item.eventDate,
      startTime: item.startTime.slice(0, 5),
      endTime: item.endTime.slice(0, 5),
      ticketPrice: item.ticketPrice,
      capacity: item.capacity,
      parkingFee: item.parkingFee
    });
    // this.bookingsService.getByEvent(item.eventId).subscribe({
    //   next: bookings => {
    //     const hasActive = bookings.some(x => x.status === 'Pending' || x.status === 'Confirmed');
    //     this.priceLocked.set(hasActive);
    //     if (hasActive) this.form.controls.ticketPrice.disable({ emitEvent: false });
    //   },
    //   error: () => undefined
    // });
  }

  reset(): void {
    this.editingId = null;
    this.priceLocked.set(false);
    this.form.controls.ticketPrice.enable({ emitEvent: false });
    this.form.reset({ name: '', venueId: 0, eventCategoryId: 0, eventDate: '', startTime: '', endTime: '', ticketPrice: 0, capacity: 1, parkingFee: 0 });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    const payload = this.form.getRawValue();
    if (payload.startTime >= payload.endTime) { this.error.set('End time must be after start time.'); return; }
    this.saving.set(true); this.error.set(''); this.success.set('');
    const request$ = this.editingId ? this.eventsService.update(this.editingId, payload) : this.eventsService.create(payload);
    request$.subscribe({
      next: () => { this.saving.set(false); this.success.set(this.editingId ? 'Event updated.' : 'Event created.'); this.reset(); this.load(); },
      error: error => { this.saving.set(false); this.error.set(apiErrorMessage(error)); }
    });
  }

  askDelete(item: EventItem): void { this.deleting = item; this.confirmOpen.set(true); }
  remove(): void {
    if (!this.deleting) return;
    this.confirmOpen.set(false);
    this.eventsService.delete(this.deleting.eventId).subscribe({
      next: result => { this.success.set(result.message); this.deleting = null; this.load(); },
      error: error => this.error.set(apiErrorMessage(error))
    });
  }
}
