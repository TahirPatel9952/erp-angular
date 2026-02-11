import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { PurchaseOrder, PurchaseOrderRequest } from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/purchase/orders`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<PurchaseOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<PurchaseOrder>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.get<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}`);
  }

  getByOrderNumber(orderNumber: string): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.get<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/number/${orderNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<PurchaseOrder>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<PurchaseOrder>>>(`${this.apiUrl}/search`, { params });
  }

  getByStatus(status: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<PurchaseOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<PurchaseOrder>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getBySupplier(supplierId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<PurchaseOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<PurchaseOrder>>>(`${this.apiUrl}/supplier/${supplierId}`, { params });
  }

  getPendingReceivable(): Observable<ApiResponse<PurchaseOrder[]>> {
    return this.http.get<ApiResponse<PurchaseOrder[]>>(`${this.apiUrl}/pending-receivable`);
  }

  create(request: PurchaseOrderRequest): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.post<ApiResponse<PurchaseOrder>>(this.apiUrl, request);
  }

  update(id: number, request: PurchaseOrderRequest): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.put<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}`, request);
  }

  approve(id: number): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.patch<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}/approve`, {});
  }

  send(id: number): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.patch<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}/send`, {});
  }

  sendToSupplier(id: number): Observable<ApiResponse<PurchaseOrder>> {
    return this.send(id);
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.patch<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}

