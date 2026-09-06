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
}