import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VenueService } from '../../../core/services/venue.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({ selector: 'app-admin-venues', standalone: true, imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, ConfirmDialogComponent], templateUrl: './admin-venues.component.html' })
export class AdminVenuesComponent  {
}