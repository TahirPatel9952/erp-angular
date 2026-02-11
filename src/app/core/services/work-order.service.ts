import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { WorkOrder, WorkOrderRequest, WorkOrderUpdateRequest, WorkOrderProgressUpdate } from '../models/work-order.model';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/production/work-orders`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<WorkOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<WorkOrder>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<WorkOrder>> {
    return this.http.get<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}`);
  }

  getByOrderNumber(orderNumber: string): Observable<ApiResponse<WorkOrder>> {
    return this.http.get<ApiResponse<WorkOrder>>(`${this.apiUrl}/number/${orderNumber}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<WorkOrder>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<WorkOrder>>>(`${this.apiUrl}/search`, { params });
  }

  getByStatus(status: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<WorkOrder>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<WorkOrder>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getBySalesOrder(salesOrderId: number): Observable<ApiResponse<WorkOrder[]>> {
    return this.http.get<ApiResponse<WorkOrder[]>>(`${this.apiUrl}/sales-order/${salesOrderId}`);
  }

  getInProgress(): Observable<ApiResponse<WorkOrder[]>> {
    return this.http.get<ApiResponse<WorkOrder[]>>(`${this.apiUrl}/in-progress`);
  }

  create(request: WorkOrderRequest): Observable<ApiResponse<WorkOrder>> {
    return this.http.post<ApiResponse<WorkOrder>>(this.apiUrl, request);
  }

  update(id: number, request: WorkOrderUpdateRequest): Observable<ApiResponse<WorkOrder>> {
    return this.http.put<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}`, request);
  }

  updateProgress(id: number, request: WorkOrderProgressUpdate): Observable<ApiResponse<WorkOrder>> {
    return this.http.patch<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}/progress`, request);
  }

  release(id: number): Observable<ApiResponse<WorkOrder>> {
    return this.http.patch<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}/release`, {});
  }

  start(id: number): Observable<ApiResponse<WorkOrder>> {
    return this.http.patch<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}/start`, {});
  }

  complete(id: number, completedQuantity?: number, rejectedQuantity?: number): Observable<ApiResponse<WorkOrder>> {
    let params = new HttpParams();
    if (completedQuantity !== undefined) {
      params = params.set('completedQuantity', completedQuantity.toString());
    }
    if (rejectedQuantity !== undefined) {
      params = params.set('rejectedQuantity', rejectedQuantity.toString());
    }
    return this.http.patch<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}/complete`, {}, { params });
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<WorkOrder>> {
    return this.http.patch<ApiResponse<WorkOrder>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}

