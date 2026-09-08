import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, PaymentSummary } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  getSummary(bookingId: number): Observable<PaymentSummary> { return this.http.get<PaymentSummary>(`${environment.apiUrl}/bookings/${bookingId}/payment`); }
  pay(bookingId: number): Observable<Payment> { return this.http.post<Payment>(`${environment.apiUrl}/bookings/${bookingId}/payment`, {}); }
  history(customerId: number): Observable<Payment[]> { return this.http.get<Payment[]>(`${environment.apiUrl}/payments/customer/${customerId}`); }
  receipt(paymentId: number): Observable<string> { return this.http.get(`${environment.apiUrl}/payments/${paymentId}/receipt`, { responseType: 'text' }); }
}
