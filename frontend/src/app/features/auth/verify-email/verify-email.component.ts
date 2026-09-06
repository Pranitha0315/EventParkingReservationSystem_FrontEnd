import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-verify-email', standalone: true, imports: [RouterLink, LoadingSpinnerComponent, ErrorMessageComponent], templateUrl: './verify-email.component.html' })
export class VerifyEmailComponent  {
 
}
