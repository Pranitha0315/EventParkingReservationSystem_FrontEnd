import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParkingService } from '../../../core/services/parking.service';
import { EventService } from '../../../core/services/event.service';
import { BookingStateService } from '../../../core/services/booking-state.service';

import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SlotCodePipe } from '../../../shared/pipes/slot-code.pipe';

type ParkingZoneView = {
  name: string;
  available: number;
  total: number;
  // left: ParkingSlot[];
  // right: ParkingSlot[];
};

@Component({
  selector: 'app-parking-map',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, SlotCodePipe],
  templateUrl: './parking-map.component.html'
})
export class ParkingMapComponent  {
}