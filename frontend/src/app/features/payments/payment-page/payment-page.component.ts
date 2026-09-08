// import { Component, OnInit, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { PaymentService } from '../../../core/services/payment.service';
// import { PaymentSummary } from '../../../core/models/payment.model';
// import { expiryFormatValidator, expiryFutureValidator, luhnValidator } from '../../../core/validators/form.validators';
// import { apiErrorMessage } from '../../../core/utils/api-error';
// import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
// import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
// import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// @Component({ selector: 'app-payment-page', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent], templateUrl: './payment-page.component.html' })
// export class PaymentPageComponent implements OnInit {
//   private readonly fb = inject(NonNullableFormBuilder);
//   private readonly service = inject(PaymentService);
//   private readonly route = inject(ActivatedRoute);
//   private readonly router = inject(Router);
//   readonly summary = signal<PaymentSummary | null>(null);
//   readonly loading = signal(true);
//   readonly paying = signal(false);
//   readonly error = signal('');
//   readonly confirmOpen = signal(false);
//   readonly cardBack = signal(false);
//   bookingId = 0;

//   readonly form = this.fb.group({
//     cardholder: ['', [Validators.required, Validators.minLength(2)]],
//     cardNumber: ['', [Validators.required, luhnValidator]],
//     expiry: ['', [Validators.required, expiryFormatValidator]],
//     cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
//   }, { validators: expiryFutureValidator });

//   ngOnInit(): void { this.bookingId = Number(this.route.snapshot.paramMap.get('id')); this.load(); }

//   load(): void {
//     this.loading.set(true); this.error.set('');
//     this.service.getSummary(this.bookingId).subscribe({
//       next: summary => { this.summary.set(summary); this.loading.set(false); },
//       error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
//     });
//   }

//   openConfirm(): void { this.form.markAllAsTouched(); if (this.form.valid && !this.summary()?.paid) this.confirmOpen.set(true); }

//   pay(): void {
//     this.confirmOpen.set(false); this.paying.set(true); this.error.set('');
//     this.service.pay(this.bookingId).subscribe({
//       next: payment => { this.paying.set(false); void this.router.navigate(['/payments', payment.paymentId, 'receipt']); },
//       error: error => { this.paying.set(false); this.error.set(apiErrorMessage(error)); this.load(); }
//     });
//   }

//   normalizeCardNumber(): void {
//     const digits = this.form.controls.cardNumber.value.replace(/\D/g, '').slice(0, 19);
//     const grouped = digits.replace(/(.{4})/g, '$1 ').trim();
//     if (grouped !== this.form.controls.cardNumber.value) {
//       this.form.controls.cardNumber.setValue(grouped, { emitEvent: false });
//     }
//   }

//   normalizeExpiry(): void {
//     const digits = this.form.controls.expiry.value.replace(/\D/g, '').slice(0, 4);
//     const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
//     if (formatted !== this.form.controls.expiry.value) {
//       this.form.controls.expiry.setValue(formatted, { emitEvent: false });
//     }
//   }

//   cardNumberDisplay(): string {
//     const digits = this.form.controls.cardNumber.value.replace(/\D/g, '').slice(0, 16).padEnd(16, '•');
//     return digits.match(/.{1,4}/g)?.join(' ') ?? '•••• •••• •••• ••••';
//   }

//   cardholderDisplay(): string { return this.form.controls.cardholder.value.trim() || 'YOUR NAME'; }
//   expiryDisplay(): string { return this.form.controls.expiry.value || 'MM/YY'; }


//   cardBrand(): string {
//     const digits = this.form.controls.cardNumber.value.replace(/\D/g, '');
//     if (digits.startsWith('4')) return 'VISA';
//     if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MASTERCARD';
//     if (/^3[47]/.test(digits)) return 'AMEX';
//     return 'CARD';
//   }
// }
