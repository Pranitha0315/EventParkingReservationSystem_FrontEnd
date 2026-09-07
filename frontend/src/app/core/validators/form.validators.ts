import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
};

export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const selected = new Date(`${control.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today ? { pastDate: true } : null;
};

export const luhnValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').replace(/\s/g, '');
  if (!value) return null;
  if (!/^\d{13,19}$/.test(value)) return { cardNumber: true };
  let sum = 0;
  let double = false;
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = Number(value[i]);
    if (double) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0 ? null : { checksum: true };
};

export const expiryFormatValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '');
  if (!value) return null;
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? null : { expiryFormat: true };
};

export const expiryFutureValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const expiry = String(control.get('expiry')?.value ?? '');
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return null;
  const [month, year] = expiry.split('/').map(Number);
  const now = new Date();
  const fullYear = 2000 + year;
  const expired = fullYear < now.getFullYear() || (fullYear === now.getFullYear() && month < now.getMonth() + 1);
  return expired ? { expiryPast: true } : null;
};

