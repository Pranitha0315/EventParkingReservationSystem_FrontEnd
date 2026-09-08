// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { Booking, CreateBookingRequest, HoldStatus } from '../models/booking.model';
// import { MessageResponse } from '../models/auth.model';

// @Injectable({ providedIn: 'root' })
// export class BookingService {
//   private readonly http = inject(HttpClient);
//   private readonly url = `${environment.apiUrl}/bookings`;

//   create(payload: CreateBookingRequest): Observable<Booking> { return this.http.post<Booking>(this.url, payload); }
//   get(id: number): Observable<Booking> { return this.http.get<Booking>(`${this.url}/${id}`); }
//   getHoldStatus(id: number): Observable<HoldStatus> { return this.http.get<HoldStatus>(`${this.url}/${id}/hold-status`); }
//   getCustomerHistory(customerId: number): Observable<Booking[]> { return this.http.get<Booking[]>(`${this.url}/customer/${customerId}`); }
//   getByEvent(eventId: number): Observable<Booking[]> { return this.http.get<Booking[]>(this.url, { params: { eventId } }); }
//   addSeats(id: number, seatIds: number[]): Observable<Booking> { return this.http.post<Booking>(`${this.url}/${id}/seats`, { seatIds }); }
//   addParking(id: number, parkingSlotId: number): Observable<Booking> { return this.http.post<Booking>(`${this.url}/${id}/parking`, { parkingSlotId }); }
//   removeParking(id: number): Observable<Booking> { return this.http.delete<Booking>(`${this.url}/${id}/parking`); }
//   cancel(id: number, reason = ''): Observable<MessageResponse> {
//     const params = reason.trim() ? { reason: reason.trim() } : undefined;
//     return this.http.delete<MessageResponse>(`${this.url}/${id}`, { params });
//   }
// }
