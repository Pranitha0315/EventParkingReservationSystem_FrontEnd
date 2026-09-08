import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Venue, VenueRequest } from '../models/venue.model';
import { MessageResponse } from '../models/auth.model';


@Injectable({ providedIn: 'root' })

export class VenueService {
  private readonly http = inject(HttpClient);
private readonly url = `${environment.apiUrl}/venues`;
private cache$?: Observable<Venue[]>;

getAll(force = false): Observable<Venue[]> {
  if (!this.cache$ || force) this.cache$ = this.http.get<Venue[]>(this.url).pipe(shareReplay(1));
  return this.cache$;
}
get(id: number): Observable<Venue> { return this.http.get<Venue>(`${this.url}/${id}`); }

getAvailable(date: string, startTime: string, endTime: string, venueId?: number): Observable<Venue[]> {
  let params = new HttpParams()
    .set('date', date)
    .set('startTime', startTime.length === 5 ? `${startTime}:00` : startTime)
    .set('endTime', endTime.length === 5 ? `${endTime}:00` : endTime);
  if (venueId) params = params.set('venueId', venueId);
  return this.http.get<Venue[]>(`${this.url}/available`, { params });
}
create(payload: VenueRequest): Observable<Venue> { return this.http.post<Venue>(this.url, payload).pipe(tap(() => this.clearCache())); }
update(id: number, payload: VenueRequest): Observable<Venue> { return this.http.put<Venue>(`${this.url}/${id}`, payload).pipe(tap(() => this.clearCache())); }
delete(id: number): Observable<MessageResponse> { return this.http.delete<MessageResponse>(`${this.url}/${id}`).pipe(tap(() => this.clearCache())); }
clearCache(): void { this.cache$ = undefined; }
}
