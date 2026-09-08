import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, RegisterCustomerRequest, UpdateCustomerRequest } from '../models/customer.model';
import { MessageResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
 private readonly http = inject(HttpClient);
private readonly url = `${environment.apiUrl}/customers`;

register(payload: RegisterCustomerRequest): Observable<Customer> {
  return this.http.post<Customer>(`${this.url}/register`, payload);
}
get(id: number): Observable<Customer> { return this.http.get<Customer>(`${this.url}/${id}`); }
update(id: number, payload: UpdateCustomerRequest): Observable<Customer> { return this.http.put<Customer>(`${this.url}/${id}`, payload); }
search(search = ''): Observable<Customer[]> { return this.http.get<Customer[]>(this.url, { params: { search } }); }
deactivate(id: number): Observable<MessageResponse> { return this.http.delete<MessageResponse>(`${this.url}/${id}`); }
reactivate(id: number): Observable<MessageResponse> { return this.http.post<MessageResponse>(`${this.url}/${id}/reactivate`, {}); }
}
