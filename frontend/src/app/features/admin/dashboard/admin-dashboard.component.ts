import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardService } from '../../../core/services/dashboard.service';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { CustomerService } from '../../../core/services/customer.service';
import { AdminDashboard } from '../../../core/models/dashboard.model';
import { Booking } from '../../../core/models/booking.model';
import { Customer } from '../../../core/models/customer.model';
import { EventItem } from '../../../core/models/event.model';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

type TrendPoint = { year: number; value: number; x: number; y: number };
type TrendSummary = { direction: 'up' | 'down' | 'flat'; difference: number; percent: number | null };

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, StatCardComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly eventService = inject(EventService);
  private readonly bookingService = inject(BookingService);
  private readonly customerService = inject(CustomerService);

  readonly data = signal<AdminDashboard | null>(null);
  readonly bookings = signal<Booking[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly loading = signal(true);
  readonly chartLoading = signal(false);
  readonly error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({
      dashboard: this.service.admin(),
      events: this.eventService.getAll().pipe(catchError(() => of([] as EventItem[]))),
      customers: this.customerService.search('').pipe(catchError(() => of([] as Customer[])))
    }).subscribe({
      next: result => {
        this.data.set(result.dashboard);
        this.customers.set(result.customers);
        this.loading.set(false);
        this.loadBookingHistory(result.events);
      },
      error: error => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  chartYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = new Set<number>();
    for (let offset = 4; offset >= 0; offset--) years.add(currentYear - offset);

    for (const customer of this.customers()) {
      const year = new Date(customer.createdAtUtc).getFullYear();
      if (Number.isFinite(year)) years.add(year);
    }
    for (const booking of this.bookings()) {
      const year = new Date(booking.createdAtUtc).getFullYear();
      if (Number.isFinite(year)) years.add(year);
    }

    const sorted = [...years].sort((a, b) => a - b);
    return sorted.length > 6 ? sorted.slice(-6) : sorted;
  }

  customerTrend(): TrendPoint[] {
    const years = this.chartYears();
    const values = years.map(year => this.customers().filter(customer => {
      const date = new Date(customer.createdAtUtc);
      return !Number.isNaN(date.getTime()) && date.getFullYear() === year;
    }).length);
    return this.toTrendPoints(years, values);
  }

  revenueTrend(): TrendPoint[] {
    const years = this.chartYears();
    const totals = years.map(year => this.bookings().reduce((sum, booking) => {
      if (!this.isRevenueBooking(booking)) return sum;
      const date = new Date(booking.createdAtUtc);
      if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) return sum;
      return sum + (Number(booking.totalAmount) || 0);
    }, 0));
    return this.toTrendPoints(years, totals);
  }

  customerPath(): string { return this.pathFor(this.customerTrend()); }
  revenuePath(): string { return this.pathFor(this.revenueTrend()); }

  customerSummary(): TrendSummary { return this.summaryFor(this.customerTrend()); }
  revenueSummary(): TrendSummary { return this.summaryFor(this.revenueTrend()); }

  latestCustomerValue(): number { return this.customerTrend().at(-1)?.value ?? 0; }
  latestRevenueValue(): number { return this.revenueTrend().at(-1)?.value ?? 0; }

  directionIcon(summary: TrendSummary): string {
    return summary.direction === 'up' ? '↑' : summary.direction === 'down' ? '↓' : '→';
  }

  trendText(summary: TrendSummary, unit: string): string {
    if (summary.direction === 'flat') return `No change from previous year`;
    const amount = unit === 'customer' ? `${summary.difference} customer${summary.difference === 1 ? '' : 's'}` : `LKR ${Math.round(summary.difference).toLocaleString()}`;
    const percent = summary.percent === null ? '' : ` (${summary.percent.toFixed(1)}%)`;
    return `${amount}${percent} ${summary.direction === 'up' ? 'more' : 'less'} than previous year`;
  }

  private loadBookingHistory(events: EventItem[]): void {
    if (!events.length) {
      this.bookings.set([]);
      this.chartLoading.set(false);
      return;
    }
    this.chartLoading.set(true);
    forkJoin(events.map(event => this.bookingService.getByEvent(event.eventId).pipe(catchError(() => of([] as Booking[]))))).subscribe({
      next: groups => {
        const unique = new Map<number, Booking>();
        for (const booking of groups.flat()) unique.set(booking.bookingId, booking);
        this.bookings.set([...unique.values()]);
        this.chartLoading.set(false);
      },
      error: () => {
        this.bookings.set([]);
        this.chartLoading.set(false);
      }
    });
  }

  private toTrendPoints(years: number[], values: number[]): TrendPoint[] {
    const max = Math.max(...values, 0);
    const minX = 8;
    const maxX = 92;
    const topY = 9;
    const bottomY = 45;
    return years.map((year, index) => {
      const x = years.length <= 1 ? 50 : minX + (index * (maxX - minX)) / (years.length - 1);
      const y = max > 0 ? bottomY - (values[index] / max) * (bottomY - topY) : bottomY;
      return { year, value: values[index], x, y };
    });
  }

  private pathFor(points: TrendPoint[]): string {
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  }

  private summaryFor(points: TrendPoint[]): TrendSummary {
    if (points.length < 2) return { direction: 'flat', difference: 0, percent: null };
    const current = points[points.length - 1].value;
    const previous = points[points.length - 2].value;
    const rawDifference = current - previous;
    const direction: TrendSummary['direction'] = rawDifference > 0 ? 'up' : rawDifference < 0 ? 'down' : 'flat';
    const percent = previous > 0 ? (Math.abs(rawDifference) / previous) * 100 : (current > 0 ? null : 0);
    return { direction, difference: Math.abs(rawDifference), percent };
  }

  private isRevenueBooking(booking: Booking): boolean {
    const status = booking.status.toLowerCase();
    return status === 'confirmed' || status === 'completed' || status === 'paid';
  }
}
