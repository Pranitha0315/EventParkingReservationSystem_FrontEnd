import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

import { BookingStateService } from '../../../core/services/booking-state.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EventItem } from '../../../core/models/event.model';

@Component({ selector: 'app-event-detail', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent], templateUrl: './event-detail.component.html' })
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly events = inject(EventService);
  private readonly state = inject(BookingStateService);
  readonly event = signal<EventItem | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  eventId = 0;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true); this.error.set('');
    this.events.get(this.eventId).subscribe({
      next: event => { this.event.set(event); this.state.setEvent(event); this.loading.set(false); },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }
}