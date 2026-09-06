import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-reset-password', standalone: true, imports: [ReactiveFormsModule, RouterLink, ErrorMessageComponent], templateUrl: './reset-password.component.html' })
export class ResetPasswordComponent {
 
}
