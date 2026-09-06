import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { EventService } from '../../core/services/event.service';

import { apiErrorMessage } from '../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, StatCardComponent], templateUrl: './dashboard.component.html' })
export class DashboardComponent  {
}