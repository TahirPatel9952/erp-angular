import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { SalesOrder, SalesOrderRequest } from '../models/sales-order.model';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/sales/orders`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<SalesOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<SalesOrder>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.get<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}`);
  }

  getByOrderNumber(orderNumber: string): Observable<ApiResponse<SalesOrder>> {
    return this.http.get<ApiResponse<SalesOrder>>(`${this.apiUrl}/number/${orderNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<SalesOrder>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<SalesOrder>>>(`${this.apiUrl}/search`, { params });
  }

  getByStatus(status: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<SalesOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<SalesOrder>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getByCustomer(customerId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<SalesOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<SalesOrder>>>(`${this.apiUrl}/customer/${customerId}`, { params });
  }

  getPending(): Observable<ApiResponse<SalesOrder[]>> {
    return this.http.get<ApiResponse<SalesOrder[]>>(`${this.apiUrl}/pending`);
  }

  getReadyToShip(): Observable<ApiResponse<SalesOrder[]>> {
    return this.http.get<ApiResponse<SalesOrder[]>>(`${this.apiUrl}/ready-to-ship`);
  }

  create(request: SalesOrderRequest): Observable<ApiResponse<SalesOrder>> {
    return this.http.post<ApiResponse<SalesOrder>>(this.apiUrl, request);
  }

  update(id: number, request: SalesOrderRequest): Observable<ApiResponse<SalesOrder>> {
    return this.http.put<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}`, request);
  }

  confirm(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.patch<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}/confirm`, {});
  }

  process(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.patch<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}/process`, {});
  }

  ship(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.patch<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}/ship`, {});
  }

  deliver(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.patch<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}/deliver`, {});
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<SalesOrder>> {
    return this.http.patch<ApiResponse<SalesOrder>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}

