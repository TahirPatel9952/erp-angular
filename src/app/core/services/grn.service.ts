import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { GRN, GRNRequest } from '../models/grn.model';

@Injectable({
  providedIn: 'root',
})
export class GRNService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/purchase/grn`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<GRN>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<GRN>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<GRN>> {
    return this.http.get<ApiResponse<GRN>>(`${this.apiUrl}/${id}`);
  }

  getByGrnNumber(grnNumber: string): Observable<ApiResponse<GRN>> {
    return this.http.get<ApiResponse<GRN>>(`${this.apiUrl}/number/${grnNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<GRN>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<GRN>>>(`${this.apiUrl}/search`, { params });
  }

  getByPurchaseOrder(purchaseOrderId: number): Observable<ApiResponse<GRN[]>> {
    return this.http.get<ApiResponse<GRN[]>>(`${this.apiUrl}/purchase-order/${purchaseOrderId}`);
  }

  getByStatus(status: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<GRN>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<GRN>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getPendingQC(): Observable<ApiResponse<GRN[]>> {
    return this.http.get<ApiResponse<GRN[]>>(`${this.apiUrl}/pending-qc`);
  }

  create(request: GRNRequest): Observable<ApiResponse<GRN>> {
    return this.http.post<ApiResponse<GRN>>(this.apiUrl, request);
  }

  update(id: number, request: GRNRequest): Observable<ApiResponse<GRN>> {
    return this.http.put<ApiResponse<GRN>>(`${this.apiUrl}/${id}`, request);
  }

  verify(id: number): Observable<ApiResponse<GRN>> {
    return this.http.patch<ApiResponse<GRN>>(`${this.apiUrl}/${id}/verify`, {});
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<GRN>> {
    return this.http.patch<ApiResponse<GRN>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}

