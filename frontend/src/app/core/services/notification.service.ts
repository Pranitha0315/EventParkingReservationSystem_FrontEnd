// import { computed, inject, Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { AppNotification } from '../models/notification.model';
// import { MessageResponse } from '../models/auth.model';

// @Injectable({ providedIn: 'root' })
// export class NotificationService {
//   private readonly http = inject(HttpClient);
//   private readonly itemsSignal = signal<AppNotification[]>([]);
//   readonly items = this.itemsSignal.asReadonly();
//   readonly unreadCount = computed(() => this.itemsSignal().filter(x => !x.isRead).length);

//   getForCustomer(customerId: number): Observable<AppNotification[]> {
//     return this.http.get<AppNotification[]>(`${environment.apiUrl}/notifications/customer/${customerId}`)
//       .pipe(tap(items => this.itemsSignal.set(items)));
//   }
//   markRead(id: number): Observable<MessageResponse> {
//     return this.http.put<MessageResponse>(`${environment.apiUrl}/notifications/${id}/read`, {})
//       .pipe(tap(() => this.itemsSignal.update(items => items.map(x => x.notificationId === id ? { ...x, isRead: true } : x))));
//   }
//   clear(): void { this.itemsSignal.set([]); }
// }
