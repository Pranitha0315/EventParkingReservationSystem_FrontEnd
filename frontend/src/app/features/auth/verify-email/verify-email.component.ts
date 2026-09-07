import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-verify-email', standalone: true, imports: [RouterLink, LoadingSpinnerComponent, ErrorMessageComponent], templateUrl: './verify-email.component.html' })

export class VerifyEmailComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly message = signal('');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!token) { this.loading.set(false); this.error.set('Verification token is missing.'); return; }
    this.auth.verifyEmail(token).subscribe({
      next: result => { this.loading.set(false); this.message.set(result.message); },
      error: error => { this.loading.set(false); this.error.set(apiErrorMessage(error)); }
    });
  }
}

