import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ErrorMessageComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly adminMode = this.route.snapshot.data['admin'] === true;
  readonly loading = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly showPassword = signal(false);
  readonly emailFocused = signal(false);
  readonly passwordFocused = signal(false);
  readonly lookX = signal(0);
  readonly lookY = signal(0);

  model = {
    email: this.adminMode ? 'admin@eventparking.local' : 'customer@eventparking.local',
    password: this.adminMode ? 'Admin@123' : 'Customer@123'
  };

  submit(form: NgForm): void {
    if (form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set('');
    this.message.set('');

    const request$ = this.adminMode
      ? this.auth.loginAdmin(this.model)
      : this.auth.loginCustomer(this.model);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate([this.adminMode ? '/admin' : '/dashboard']);
      },
      error: error => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error));
      }
    });
  }

  resendVerification(): void {
    if (!this.model.email || this.loading() || this.adminMode) return;

    this.loading.set(true);
    this.error.set('');
    this.message.set('');

    this.auth.resendVerification(this.model.email).subscribe({
      next: result => {
        this.loading.set(false);
        this.message.set(result.message);
      },
      error: error => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error));
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  trackMascot(event: PointerEvent): void {
    if (this.passwordFocused()) return;

    const host = event.currentTarget as HTMLElement | null;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
    const relativeY = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.42;

    this.lookX.set(this.clamp(relativeX * 12, -6, 6));
    this.lookY.set(this.clamp(relativeY * 9, -4, 4));
  }

  resetMascot(): void {
    if (!this.emailFocused()) {
      this.lookX.set(0);
      this.lookY.set(0);
    }
  }

  focusEmail(): void {
    this.emailFocused.set(true);
    this.passwordFocused.set(false);
  }

  blurEmail(): void {
    this.emailFocused.set(false);
    this.resetMascot();
  }

  focusPassword(): void {
    this.passwordFocused.set(true);
    this.emailFocused.set(false);
    this.lookX.set(0);
    this.lookY.set(0);
  }

  blurPassword(): void {
    this.passwordFocused.set(false);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}