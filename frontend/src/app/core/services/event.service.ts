import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../models/auth.model';
import { EventFilters, EventItem, EventRequest } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService { 
 private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/events`;

  getAll(filters: EventFilters = {}): Observable<EventItem[]> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.date) params = params.set('date', filters.date);
    if (filters.venueId) params = params.set('venueId', filters.venueId);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    return this.http.get<EventItem[]>(this.url, { params });
  }
  get(id: number): Observable<EventItem> { return this.http.get<EventItem>(`${this.url}/${id}`); }
  create(payload: EventRequest): Observable<EventItem> { return this.http.post<EventItem>(this.url, this.normalize(payload)); }
  update(id: number, payload: EventRequest): Observable<EventItem> { return this.http.put<EventItem>(`${this.url}/${id}`, this.normalize(payload)); }

  private normalize(payload: EventRequest): EventRequest {
    return {
      ...payload,
      startTime: payload.startTime.length === 5 ? `${payload.startTime}:00` : payload.startTime,
      endTime: payload.endTime.length === 5 ? `${payload.endTime}:00` : payload.endTime
    };
  }
  delete(id: number): Observable<MessageResponse> { return this.http.delete<MessageResponse>(`${this.url}/${id}`); }
}
