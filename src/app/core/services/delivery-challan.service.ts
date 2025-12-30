import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { DeliveryChallan, DeliveryChallanRequest } from '../models/delivery-challan.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryChallanService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/delivery/challans`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<DeliveryChallan>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<DeliveryChallan>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.get<ApiResponse<DeliveryChallan>>(`${this.apiUrl}/${id}`);
  }

  getByChallanNumber(challanNumber: string): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.get<ApiResponse<DeliveryChallan>>(`${this.apiUrl}/number/${challanNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<DeliveryChallan>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<DeliveryChallan>>>(`${this.apiUrl}/search`, { params });
  }

  getBySalesOrder(salesOrderId: number): Observable<ApiResponse<DeliveryChallan[]>> {
    return this.http.get<ApiResponse<DeliveryChallan[]>>(`${this.apiUrl}/sales-order/${salesOrderId}`);
  }

  getByStatus(status: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<DeliveryChallan>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<DeliveryChallan>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getReadyToDispatch(): Observable<ApiResponse<DeliveryChallan[]>> {
    return this.http.get<ApiResponse<DeliveryChallan[]>>(`${this.apiUrl}/ready-to-dispatch`);
  }

  getInTransit(): Observable<ApiResponse<DeliveryChallan[]>> {
    return this.http.get<ApiResponse<DeliveryChallan[]>>(`${this.apiUrl}/in-transit`);
  }

  create(request: DeliveryChallanRequest): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.post<ApiResponse<DeliveryChallan>>(this.apiUrl, request);
  }

  update(id: number, request: DeliveryChallanRequest): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.put<ApiResponse<DeliveryChallan>>(`${this.apiUrl}/${id}`, request);
  }

  dispatch(id: number): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.patch<ApiResponse<DeliveryChallan>>(`${this.apiUrl}/${id}/dispatch`, {});
  }

  markDelivered(id: number): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.patch<ApiResponse<DeliveryChallan>>(`${this.apiUrl}/${id}/deliver`, {});
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<DeliveryChallan>> {
    return this.http.patch<ApiResponse<DeliveryChallan>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}

