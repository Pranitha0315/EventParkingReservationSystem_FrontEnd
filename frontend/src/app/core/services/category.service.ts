import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


// @Injectable({ providedIn: 'root' })
// export class CategoryService {
//  private readonly http = inject(HttpClient);
//  private readonly url = `${environment.apiUrl}/categories`;
//  private cache$?: Observable<EventCategory[]>;

//  getAll(force = false): Observable<EventCategory[]> {
//    if (!this.cache$ || force) this.cache$ = this.http.get<EventCategory[]>(this.url).pipe(shareReplay(1));
//    return this.cache$;
//  }
//  create(payload: CategoryRequest): Observable<EventCategory> { return this.http.post<EventCategory>(this.url, payload).pipe(tap(() => this.clearCache())); }
//  update(id: number, payload: CategoryRequest): Observable<EventCategory> { return this.http.put<EventCategory>(`${this.url}/${id}`, payload).pipe(tap(() => this.clearCache())); }
//  delete(id: number): Observable<MessageResponse> { return this.http.delete<MessageResponse>(`${this.url}/${id}`).pipe(tap(() => this.clearCache())); }
//  clearCache(): void { this.cache$ = undefined; }


  
// }
