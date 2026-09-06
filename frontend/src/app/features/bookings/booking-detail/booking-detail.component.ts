import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../../core/services/booking.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SeatLabelPipe } from '../../../shared/pipes/seat-label.pipe';
import { BookingStatusPipe } from '../../../shared/pipes/booking-status.pipe';

@Component({ selector: 'app-booking-detail', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, StatusBadgeComponent, ConfirmDialogComponent, SeatLabelPipe, BookingStatusPipe], templateUrl: './booking-detail.component.html' })
export class BookingDetailComponent {
}