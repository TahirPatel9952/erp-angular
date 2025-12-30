import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { Payment, PaymentRequest } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/invoicing/payments`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Payment>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<Payment>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Payment>> {
    return this.http.get<ApiResponse<Payment>>(`${this.apiUrl}/${id}`);
  }

  getByPaymentNumber(paymentNumber: string): Observable<ApiResponse<Payment>> {
    return this.http.get<ApiResponse<Payment>>(`${this.apiUrl}/number/${paymentNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Payment>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.apiUrl}/search`, { params });
  }

  getByInvoice(invoiceId: number): Observable<ApiResponse<Payment[]>> {
    return this.http.get<ApiResponse<Payment[]>>(`${this.apiUrl}/invoice/${invoiceId}`);
  }

  getByCustomer(customerId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Payment>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.apiUrl}/customer/${customerId}`, { params });
  }

  getBySupplier(supplierId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Payment>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.apiUrl}/supplier/${supplierId}`, { params });
  }

  getReceived(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Payment>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.apiUrl}/received`, { params });
  }

  getMade(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Payment>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.apiUrl}/made`, { params });
  }

  create(request: PaymentRequest): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(this.apiUrl, request);
  }

  update(id: number, request: PaymentRequest): Observable<ApiResponse<Payment>> {
    return this.http.put<ApiResponse<Payment>>(`${this.apiUrl}/${id}`, request);
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<Payment>> {
    return this.http.patch<ApiResponse<Payment>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  generateReceipt(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/receipt`, { responseType: 'blob' });
  }
}

