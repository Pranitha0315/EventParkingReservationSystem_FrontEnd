import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardService } from '../../../core/services/dashboard.service';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { CustomerService } from '../../../core/services/customer.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

type TrendPoint = { year: number; value: number; x: number; y: number };
type TrendSummary = { direction: 'up' | 'down' | 'flat'; difference: number; percent: number | null };

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, StatCardComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent  {
}