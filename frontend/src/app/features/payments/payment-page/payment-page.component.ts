import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({ selector: 'app-payment-page', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent], templateUrl: './payment-page.component.html' })
export class PaymentPageComponent  {
}