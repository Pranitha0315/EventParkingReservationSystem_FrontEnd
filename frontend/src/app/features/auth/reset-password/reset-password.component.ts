import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-reset-password', standalone: true, imports: [ReactiveFormsModule, RouterLink, ErrorMessageComponent], templateUrl: './reset-password.component.html' })

export class ResetPasswordComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  readonly loading = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]] });

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.token) { this.error.set('Reset token is missing from the URL.'); return; }
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true); this.error.set('');
    this.auth.resetPassword(this.token, this.form.controls.newPassword.value).subscribe({
      next: result => { this.loading.set(false); this.message.set(result.message); },
      error: error => { this.loading.set(false); this.error.set(apiErrorMessage(error)); }
    });
  }
}

