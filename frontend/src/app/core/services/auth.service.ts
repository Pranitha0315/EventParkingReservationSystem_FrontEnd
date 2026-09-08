import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, MessageResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
[x: string]: any;
private readonly http = inject(HttpClient);
private readonly storageKey = 'eprs-auth';
private readonly userSignal = signal<AuthResponse | null>(this.restoreSession());

readonly user = this.userSignal.asReadonly();
readonly isLoggedIn = computed(() => this.userSignal() !== null);
readonly isAdmin = computed(() => this.userSignal()?.role === 'Administrator');
readonly isCustomer = computed(() => this.userSignal()?.role === 'Customer');
readonly token = computed(() => this.userSignal()?.token ?? null);

loginCustomer(payload: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
    .pipe(tap(user => this.saveSession(user)));
}

loginAdmin(payload: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/admin-login`, payload)
    .pipe(tap(user => this.saveSession(user)));
}

forgotPassword(email: string): Observable<MessageResponse> {
  return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/forgot-password`, { email });
}

resetPassword(token: string, newPassword: string): Observable<MessageResponse> {
  return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/reset-password`, { token, newPassword });
}

verifyEmail(token: string): Observable<MessageResponse> {
  return this.http.get<MessageResponse>(`${environment.apiUrl}/auth/verify-email`, { params: { token } });
}

resendVerification(email: string): Observable<MessageResponse> {
  return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/resend-verification`, { email });
}

logout(): void {
  this.userSignal.set(null);
  sessionStorage.removeItem(this.storageKey);
}

private saveSession(user: AuthResponse): void {
  this.userSignal.set(user);
  sessionStorage.setItem(this.storageKey, JSON.stringify(user));
}

private restoreSession(): AuthResponse | null {
  try {
    const raw = sessionStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as AuthResponse : null;
  } catch {
    sessionStorage.removeItem(this.storageKey);
    return null;
  }
}

}
  