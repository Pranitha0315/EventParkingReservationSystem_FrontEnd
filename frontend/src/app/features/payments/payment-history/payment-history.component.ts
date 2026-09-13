import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Payment } from '../../../core/models/payment.model';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({ selector: 'app-payment-history', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, StatusBadgeComponent], templateUrl: './payment-history.component.html' })
export class PaymentHistoryComponent implements OnInit {
  private readonly service = inject(PaymentService);
  private readonly auth = inject(AuthService);
  readonly items = signal<Payment[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  ngOnInit(): void { this.load(); }
  load(): void {
    const id = this.auth.user()?.userId; if (!id) return;
    this.loading.set(true); this.error.set('');
    this.service.history(id).subscribe({ next: items => { this.items.set(items); this.loading.set(false); }, error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } });
  }
}
