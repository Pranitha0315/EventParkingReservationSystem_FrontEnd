import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '../../../core/services/event.service';
import { VenueService } from '../../../core/services/venue.service';
import { CategoryService } from '../../../core/services/category.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventCategory } from '../../../core/models/category.model';
import { EventItem } from '../../../core/models/event.model';
import { Venue } from '../../../core/models/venue.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, EventCardComponent],
  templateUrl: './event-list.component.html'
})
export class EventListComponent {
  private readonly eventService = inject(EventService);
  private readonly venueService = inject(VenueService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly events = signal<EventItem[]>([]);
  readonly venues = signal<Venue[]>([]);
  readonly categories = signal<EventCategory[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  filters = { name: '', date: '', venueId: '', categoryId: '' };


  constructor() {
    forkJoin({ venues: this.venueService.getAll(), categories: this.categoryService.getAll() })
      .subscribe({
        next: data => { this.venues.set(data.venues); },
        error: () => undefined
      });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.filters = {
        name: params.get('name') ?? params.get('search') ?? '',
        date: params.get('date') ?? '',
        venueId: params.get('venueId') ?? params.get('venue') ?? '',
        categoryId: params.get('categoryId') ?? params.get('category') ?? ''
      };
      this.load();
    });
  }

  applyFilters(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.filters.name || null,
        date: this.filters.date || null,
        venue: this.filters.venueId || null,
        category: this.filters.categoryId || null
      }
    });
  }

  clearFilters(): void {
    this.filters = { name: '', date: '', venueId: '', categoryId: '' };
    void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.eventService.getAll({
      name: this.filters.name || undefined,
      date: this.filters.date || undefined,
      venueId: this.filters.venueId ? Number(this.filters.venueId) : undefined,
      categoryId: this.filters.categoryId ? Number(this.filters.categoryId) : undefined
    }).subscribe({
      next: items => { this.events.set(items); this.loading.set(false); },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }
}

