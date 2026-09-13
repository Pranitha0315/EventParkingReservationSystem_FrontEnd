import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../models/auth.model';
import { ParkingSlot, CreateParkingLayoutRequest, UpdateParkingSlotRequest } from '../models/parking.model';

@Injectable({ providedIn: 'root' })
export class ParkingService {
 private readonly http = inject(HttpClient);
  private base(eventId: number): string { return `${environment.apiUrl}/events/${eventId}/parking-slots`; }
  getLayout(eventId: number): Observable<ParkingSlot[]> { return this.http.get<ParkingSlot[]>(this.base(eventId)); }
  createLayout(eventId: number, payload: CreateParkingLayoutRequest): Observable<ParkingSlot[]> { return this.http.post<ParkingSlot[]>(this.base(eventId), payload); }
  update(eventId: number, slotId: number, payload: UpdateParkingSlotRequest): Observable<ParkingSlot> { return this.http.put<ParkingSlot>(`${this.base(eventId)}/${slotId}`, payload); }
  delete(eventId: number, slotId: number): Observable<MessageResponse> { return this.http.delete<MessageResponse>(`${this.base(eventId)}/${slotId}`); }
}
