import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SeatService } from '../../../core/services/seat.service';
import { EventService } from '../../../core/services/event.service';
import { BookingStateService } from '../../../core/services/booking-state.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { SeatItemComponent } from '../seat-item/seat-item.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SeatLabelPipe } from '../../../shared/pipes/seat-label.pipe';

type SeatLayoutKind = 'concert' | 'sports' | 'theatre' | 'standard';

@Component({ selector: 'app-seat-map', standalone: true, imports: [CommonModule, RouterLink, SeatItemComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, SeatLabelPipe], templateUrl: './seat-map.component.html' })
export class SeatMapComponent {
}