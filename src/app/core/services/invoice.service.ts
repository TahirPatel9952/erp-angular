import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { Invoice, InvoiceRequest } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/invoicing/invoices`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Invoice>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<Invoice>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Invoice>> {
    return this.http.get<ApiResponse<Invoice>>(`${this.apiUrl}/${id}`);
  }

  getByInvoiceNumber(invoiceNumber: string): Observable<ApiResponse<Invoice>> {
    return this.http.get<ApiResponse<Invoice>>(`${this.apiUrl}/number/${invoiceNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Invoice>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Invoice>>>(`${this.apiUrl}/search`, { params });
  }

  getByCustomer(customerId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Invoice>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Invoice>>>(`${this.apiUrl}/customer/${customerId}`, { params });
  }

  getByStatus(status: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Invoice>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Invoice>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getUnpaid(): Observable<ApiResponse<Invoice[]>> {
    return this.http.get<ApiResponse<Invoice[]>>(`${this.apiUrl}/unpaid`);
  }

  getOverdue(): Observable<ApiResponse<Invoice[]>> {
    return this.http.get<ApiResponse<Invoice[]>>(`${this.apiUrl}/overdue`);
  }

  create(request: InvoiceRequest): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(this.apiUrl, request);
  }

  createFromSalesOrder(salesOrderId: number): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(`${this.apiUrl}/from-sales-order/${salesOrderId}`, {});
  }

  createFromDeliveryChallan(challanId: number): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(`${this.apiUrl}/from-challan/${challanId}`, {});
  }

  update(id: number, request: InvoiceRequest): Observable<ApiResponse<Invoice>> {
    return this.http.put<ApiResponse<Invoice>>(`${this.apiUrl}/${id}`, request);
  }

  send(id: number): Observable<ApiResponse<Invoice>> {
    return this.http.patch<ApiResponse<Invoice>>(`${this.apiUrl}/${id}/send`, {});
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<Invoice>> {
    return this.http.patch<ApiResponse<Invoice>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  void(id: number, reason?: string): Observable<ApiResponse<Invoice>> {
    return this.http.patch<ApiResponse<Invoice>>(`${this.apiUrl}/${id}/void`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  sendEmail(id: number, email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/send-email`, { email });
  }

  markPaid(id: number, paymentDate: string): Observable<ApiResponse<Invoice>> {
    return this.http.patch<ApiResponse<Invoice>>(`${this.apiUrl}/${id}/mark-paid`, { paymentDate });
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}

