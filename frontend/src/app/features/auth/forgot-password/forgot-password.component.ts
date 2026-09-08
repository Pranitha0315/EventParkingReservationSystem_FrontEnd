import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-forgot-password', standalone: true, imports: [FormsModule, RouterLink, ErrorMessageComponent], templateUrl: './forgot-password.component.html' })
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);
  email = '';
  readonly loading = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  submit(form: NgForm): void {
    if (form.invalid || this.loading()) return;
    this.loading.set(true); this.error.set(''); this.message.set('');
    this.auth.forgotPassword(this.email).subscribe({
      next: result => { this.loading.set(false); this.message.set(result.message); },
      error: error => { this.loading.set(false); this.error.set(apiErrorMessage(error)); }
    });
  }
}
