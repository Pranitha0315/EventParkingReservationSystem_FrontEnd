import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDashboard, CustomerDashboard } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  customer(): Observable<CustomerDashboard> { return this.http.get<CustomerDashboard>(`${environment.apiUrl}/dashboard/customer`); }
  admin(): Observable<AdminDashboard> { return this.http.get<AdminDashboard>(`${environment.apiUrl}/dashboard/admin`); }
}
