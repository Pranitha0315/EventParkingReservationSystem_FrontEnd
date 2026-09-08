import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { apiErrorMessage } from '../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({ selector: 'app-notifications', standalone: true, imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent], templateUrl: './notifications.component.html' })
export class NotificationsComponent implements OnInit {
  readonly service = inject(NotificationService);
  private readonly auth = inject(AuthService);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void { this.load(); }
  load(): void {
    const id = this.auth.user()?.userId; if (!id) return;
    this.loading.set(true); this.error.set('');
    this.service.getForCustomer(id).subscribe({
      next: () => this.loading.set(false),
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }
  markRead(id: number): void {
    this.service.markRead(id).subscribe({ error: error => this.error.set(apiErrorMessage(error)) });
  }
}
