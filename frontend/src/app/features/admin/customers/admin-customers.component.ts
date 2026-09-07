import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerService } from '../../../core/services/customer.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Customer } from '../../../core/models/customer.model';

@Component({ selector: 'app-admin-customers', standalone: true, imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, StatusBadgeComponent, ConfirmDialogComponent], templateUrl: './admin-customers.component.html' })
export class AdminCustomersComponent {
  private readonly service = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly customers = signal<Customer[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly confirmOpen = signal(false);
  search = '';
  selected: Customer | null = null;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.search = params.get('search') ?? '';
      this.load();
    });
  }
  applySearch(): void { void this.router.navigate([], { relativeTo: this.route, queryParams: { search: this.search || null } }); }
  load(): void {
    this.loading.set(true); this.error.set('');
    this.service.search(this.search).subscribe({ next: items => { this.customers.set(items); this.loading.set(false); }, error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } });
  }
  askToggle(customer: Customer): void { this.selected = customer; this.confirmOpen.set(true); }
  toggleStatus(): void {
    const customer = this.selected; if (!customer) return;
    this.confirmOpen.set(false); this.error.set(''); this.success.set('');
    const request$ = customer.status === 'Deactivated' ? this.service.reactivate(customer.customerId) : this.service.deactivate(customer.customerId);
    request$.subscribe({ next: result => { this.success.set(result.message); this.load(); }, error: error => this.error.set(apiErrorMessage(error)) });
  }
}
