import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';

import { apiErrorMessage } from '../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { Customer } from '../../core/models/customer.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorMessageComponent, StatusBadgeComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(CustomerService);
  private readonly auth = inject(AuthService);

  readonly customer = signal<Customer | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly avatarMessage = signal('');

  readonly avatars = [
    { id: 'ocean', src: '/assets/avatars/avatar-1.svg', label: 'Ocean' },
    { id: 'sunset', src: '/assets/avatars/avatar-2.svg', label: 'Sunset' },
    { id: 'mint', src: '/assets/avatars/avatar-3.svg', label: 'Mint' },
    { id: 'lavender', src: '/assets/avatars/avatar-4.svg', label: 'Lavender' }
  ] as const;

  readonly selectedAvatarId = signal<(typeof this.avatars)[number]['id']>('ocean');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    const id = this.auth.user()?.userId;
    if (!id) return;
    this.loading.set(true);
    this.error.set('');
    this.loadStoredAvatar(id);
    this.service.get(id).subscribe({
      next: customer => {
        this.customer.set(customer);
        this.form.setValue({ name: customer.name, phone: customer.phone });
        this.loading.set(false);
      },
      error: error => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    const id = this.auth.user()?.userId;
    if (!id || this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.service.update(id, this.form.getRawValue()).subscribe({
      next: customer => {
        this.customer.set(customer);
        this.saving.set(false);
        this.success.set('Profile updated successfully.');
      },
      error: error => {
        this.error.set(apiErrorMessage(error));
        this.saving.set(false);
      }
    });
  }

  chooseAvatar(avatarId: (typeof this.avatars)[number]['id']): void {
    this.selectedAvatarId.set(avatarId);
    const id = this.auth.user()?.userId;
    if (id) {
      try { localStorage.setItem(this.avatarKey(id), avatarId); }
      catch { /* Browser storage can be unavailable; the current selection still works. */ }
    }
    this.avatarMessage.set('Avatar updated.');
  }

  selectedAvatarSrc(): string {
    return this.avatars.find(avatar => avatar.id === this.selectedAvatarId())?.src ?? this.avatars[0].src;
  }

  accountStateText(status: string): string {
    return status.toLowerCase() === 'deactivated' ? 'Account inactive' : 'Account active';
  }

  private loadStoredAvatar(id: number): void {
    try {
      const stored = localStorage.getItem(this.avatarKey(id));
      if (stored && this.avatars.some(avatar => avatar.id === stored)) {
        this.selectedAvatarId.set(stored as (typeof this.avatars)[number]['id']);
      }
    } catch {
      this.selectedAvatarId.set('ocean');
    }
  }

  private avatarKey(id: number): string { return `eprs-profile-avatar-${id}`; }
}
