import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SeatService } from '../../../core/services/seat.service';
import { EventService } from '../../../core/services/event.service';
import { BookingStateService } from '../../../core/services/booking-state.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { SeatItemComponent } from '../seat-item/seat-item.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SeatLabelPipe } from '../../../shared/pipes/seat-label.pipe';
import { EventItem } from '../../../core/models/event.model';
import { Seat } from '../../../core/models/seat.model';

type SeatLayoutKind = 'concert' | 'sports' | 'theatre' | 'standard';

@Component({ selector: 'app-seat-map', standalone: true, imports: [CommonModule, RouterLink, SeatItemComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, SeatLabelPipe], templateUrl: './seat-map.component.html' })
export class SeatMapComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seatService = inject(SeatService);
  private readonly eventService = inject(EventService);
  readonly state = inject(BookingStateService);
  readonly seats = signal<Seat[]>([]);
  readonly event = signal<EventItem | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly requestedSeatCount = signal(2);
  eventId = 0;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true); this.error.set('');
    forkJoin({ event: this.eventService.get(this.eventId), seats: this.seatService.getMap(this.eventId) }).subscribe({
      next: data => {
        this.event.set(data.event); this.state.setEvent(data.event); this.seats.set(data.seats); this.loading.set(false);
        const available = new Set(data.seats.filter(x => x.status === 'Available').map(x => x.seatId));
        this.state.keepAvailableSeats(available);
        const maxQuickCount = Math.max(1, Math.min(6, available.size));
        if (this.requestedSeatCount() > maxQuickCount) this.requestedSeatCount.set(maxQuickCount);
      },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }

  // selected(seat: Seat): boolean { return this.state.seats().some(x => x.seatId === seat.seatId); }
  toggle(seat: Seat): void { this.state.toggleSeat(seat); }
  // continue(): void { if (this.state.seatCount() > 0) void this.router.navigate(['/events', this.eventId, 'parking']); }
  clearSelection(): void { this.state.clearSeats(); }

  seatCountOptions(): number[] {
    const limit = Math.max(1, Math.min(6, this.availableSeatCount()));
    return Array.from({ length: limit }, (_, index) => index + 1);
  }

  setRequestedSeatCount(count: number): void {
    this.requestedSeatCount.set(count);
  }

  autoSelectRequested(): void {
    const wanted = Math.max(1, this.requestedSeatCount());

    for (const row of this.seatRows()) {
      let run: Seat[] = [];
      for (const seat of row) {
        if (seat.status === 'Available') {
          run.push(seat);
          if (run.length === wanted) {
            this.state.replaceSeats(run);
            return;
          }
        } else {
          run = [];
        }
      }
    }

    const fallback = this.seats()
      .filter(seat => seat.status === 'Available')
      .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }))
      .slice(0, wanted);
    this.state.replaceSeats(fallback);
  }

  availableSeatCount(): number {
    return this.seats().filter(seat => seat.status === 'Available').length;
  }

  layoutKind(): SeatLayoutKind {
    const item = this.event();
    const text = `${item?.name ?? ''} ${item?.categoryName ?? ''}`.toLowerCase();
    if (/(music|concert|dj|festival|live|band|show|sing)/.test(text)) return 'concert';
    if (/(sport|cricket|football|rugby|basket|match|game|tournament|stadium)/.test(text)) return 'sports';
    if (/(conference|cinema|movie|theatre|theater|drama|seminar|workshop|business|lecture)/.test(text)) return 'theatre';
    return 'standard';
  }

  layoutLabel(): string {
    switch (this.layoutKind()) {
      case 'concert': return 'Round Concert Arena';
      case 'sports': return 'Stadium Seating';
      case 'theatre': return 'Theatre Seating';
      default: return 'Event Hall Seating';
    }
  }

  layoutHint(): string {
    switch (this.layoutKind()) {
      case 'concert': return 'Seats curve around the live stage for a concert-style view.';
      case 'sports': return 'Seats are grouped around the field like a stadium.';
      case 'theatre': return 'Rows face the stage or screen in theatre style.';
      default: return 'Rows face the main event area.';
    }
  }

  seatRows(): Seat[][] {
    const items = [...this.seats()].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }));
    const groups = new Map<string, Seat[]>();

    for (const seat of items) {
      const match = seat.seatNumber.trim().match(/^([A-Za-z]+)[\s_-]?(\d+)/);
      const key = match?.[1]?.toUpperCase() ?? '';
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(seat);
    }

    if (groups.size > 1) {
      return [...groups.entries()]
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([, row]) => row.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })));
    }

    const columns = Math.max(5, Math.min(12, Math.ceil(Math.sqrt(Math.max(items.length, 1) * 1.7))));
    const rows: Seat[][] = [];
    for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
    return rows;
  }

  concertSeatTransform(index: number, total: number): string {
    const middle = (total - 1) / 2;
    const distance = index - middle;
    const y = Math.abs(distance) * 2.3;
    const rotate = distance * 1.25;
    return `translateY(${y}px) rotate(${rotate}deg)`;
  }

  sportsSection(index: number): Seat[] {
    const items = [...this.seats()].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }));
    const start = Math.floor((items.length * index) / 4);
    const end = Math.floor((items.length * (index + 1)) / 4);
    return items.slice(start, end);
  }
}
