import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { EventService } from '../../core/services/event.service';
import { CustomerDashboard } from '../../core/models/dashboard.model';
import { EventItem } from '../../core/models/event.model';
import { apiErrorMessage } from '../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, StatCardComponent], templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly eventsService = inject(EventService);
  readonly data = signal<CustomerDashboard | null>(null);
  readonly featuredEvents = signal<EventItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set('');
    forkJoin({
      dashboard: this.service.customer(),
      events: this.eventsService.getAll().pipe(catchError(() => of([] as EventItem[])))
    }).subscribe({
      next: result => {
        this.data.set(result.dashboard);
        this.featuredEvents.set(result.events.slice(0, 3));
        this.loading.set(false);
      },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }

  eventIcon(event: EventItem): string {
    const text = `${event.name} ${event.categoryName}`.toLowerCase();
    if (/(music|concert|dj|festival|live|band)/.test(text)) return '🎵';
    if (/(sport|cricket|football|rugby|basket|match|game)/.test(text)) return '🏟️';
    if (/(conference|seminar|business|workshop|lecture)/.test(text)) return '🎤';
    if (/(movie|cinema|theatre|theater|drama)/.test(text)) return '🎭';
    return '✨';
  }

  eventTheme(event: EventItem): string {
    const text = `${event.name} ${event.categoryName}`.toLowerCase();
    if (/(music|concert|dj|festival|live|band)/.test(text)) return 'event-theme-music';
    if (/(sport|cricket|football|rugby|basket|match|game)/.test(text)) return 'event-theme-sport';
    if (/(conference|seminar|business|workshop|lecture)/.test(text)) return 'event-theme-talk';
    return 'event-theme-default';
  }
}
