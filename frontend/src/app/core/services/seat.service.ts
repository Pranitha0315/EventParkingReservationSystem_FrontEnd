import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../models/auth.model';
import { Seat, CreateSeatMapRequest, UpdateSeatRequest } from '../models/seat.model';


@Injectable({ providedIn: 'root' })
export class SeatService {
 private readonly http = inject(HttpClient);
  private base(eventId: number): string { return `${environment.apiUrl}/events/${eventId}/seats`; }
  getMap(eventId: number): Observable<Seat[]> { return this.http.get<Seat[]>(this.base(eventId)); }
  createMap(eventId: number, payload: CreateSeatMapRequest): Observable<Seat[]> { return this.http.post<Seat[]>(this.base(eventId), payload); }
  update(eventId: number, seatId: number, payload: UpdateSeatRequest): Observable<Seat> { return this.http.put<Seat>(`${this.base(eventId)}/${seatId}`, payload); }
  delete(eventId: number, seatId: number): Observable<MessageResponse> { return this.http.delete<MessageResponse>(`${this.base(eventId)}/${seatId}`); }
}

