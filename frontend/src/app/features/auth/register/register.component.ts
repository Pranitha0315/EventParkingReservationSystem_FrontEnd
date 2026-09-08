import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { passwordMatchValidator } from '../../../core/validators/form.validators';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrorMessageComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly customers = inject(CustomerService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly activeField = signal<'name' | 'email' | 'phone' | 'password' | ''>('');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.customers.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Account created successfully. Check your email for verification if it is enabled.');
        setTimeout(() => void this.router.navigate(['/login']), 1200);
      },
      error: error => {
        this.loading.set(false);
        const message = apiErrorMessage(error);
        this.error.set(message);
        if (message.toLowerCase().includes('email')) {
          this.form.controls.email.setErrors({ duplicate: true });
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  setActiveField(field: 'name' | 'email' | 'phone' | 'password' | ''): void {
    this.activeField.set(field);
  }

  displayName(): string {
    return this.form.controls.name.value.trim() || 'YOUR NAME';
  }

  displayEmail(): string {
    return this.form.controls.email.value.trim() || 'you@example.com';
  }

  initials(): string {
    const name = this.form.controls.name.value.trim();
    if (!name) return 'EP';
    return name.split(/\s+/).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('') || 'EP';
  }

  passwordScore(): number {
    const value = this.form.controls.password.value;
    if (!value) return 0;

    let score = 0;
    if (value.length >= 8) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    return score;
  }

  passwordLabel(): string {
    const score = this.passwordScore();
    if (score === 0) return 'Start typing';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  }

  progressPercent(): number {
    let complete = 0;
    if (this.form.controls.name.valid) complete++;
    if (this.form.controls.email.valid) complete++;
    if (this.form.controls.phone.valid) complete++;
    if (this.form.controls.password.valid) complete++;
    if (this.form.controls.confirmPassword.valid && !this.form.errors?.['passwordMismatch']) complete++;
    return complete * 20;
  }
}