import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-forgot-password', standalone: true, imports: [FormsModule, RouterLink, ErrorMessageComponent], templateUrl: './forgot-password.component.html' })
export class ForgotPasswordComponent {
  
}
