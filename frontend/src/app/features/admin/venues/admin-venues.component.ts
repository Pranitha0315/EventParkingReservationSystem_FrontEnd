import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VenueService } from '../../../core/services/venue.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Venue } from '../../../core/models/venue.model';

@Component({ selector: 'app-admin-venues', standalone: true, imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, ConfirmDialogComponent], templateUrl: './admin-venues.component.html' })

export class AdminVenuesComponent implements OnInit {
  private readonly service = inject(VenueService);
  readonly venues = signal<Venue[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly confirmOpen = signal(false);
  editingId: number | null = null;
  deleting: Venue | null = null;
  model = { name: '', address: '', totalCapacity: 1 };

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading.set(true); this.error.set('');
    this.service.getAll(true).subscribe({ next: items => { this.venues.set(items); this.loading.set(false); }, error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } });
  }
  edit(venue: Venue): void { this.editingId = venue.venueId; this.model = { name: venue.name, address: venue.address, totalCapacity: venue.totalCapacity }; }
  reset(): void { this.editingId = null; this.model = { name: '', address: '', totalCapacity: 1 }; }
  save(form: NgForm): void {
    if (form.invalid || this.saving()) return;
    this.saving.set(true); this.error.set(''); this.success.set('');
    const request$ = this.editingId ? this.service.update(this.editingId, this.model) : this.service.create(this.model);
    request$.subscribe({ next: () => { this.saving.set(false); this.success.set(this.editingId ? 'Venue updated.' : 'Venue created.'); this.reset(); form.resetForm(this.model); this.load(); }, error: error => { this.saving.set(false); this.error.set(apiErrorMessage(error)); } });
  }
  askDelete(venue: Venue): void { this.deleting = venue; this.confirmOpen.set(true); }
  remove(): void {
    if (!this.deleting) return;
    this.confirmOpen.set(false);
    this.service.delete(this.deleting.venueId).subscribe({ next: result => { this.success.set(result.message); this.deleting = null; this.load(); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
}



