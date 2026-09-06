import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { SeatService } from '../../../core/services/seat.service';
import { ParkingService } from '../../../core/services/parking.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({ selector: 'app-admin-layouts', standalone: true, imports: [CommonModule, FormsModule, ErrorMessageComponent, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent], templateUrl: './admin-layouts.component.html' })
export class AdminLayoutsComponent {
}