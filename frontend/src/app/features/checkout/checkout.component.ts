import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { SeatService } from '../../core/services/seat.service';
import { ParkingService } from '../../core/services/parking.service';
import { apiErrorMessage } from '../../core/utils/api-error';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SeatLabelPipe } from '../../shared/pipes/seat-label.pipe';
import { SlotCodePipe } from '../../shared/pipes/slot-code.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ErrorMessageComponent, ConfirmDialogComponent, SeatLabelPipe, SlotCodePipe],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent  {
}