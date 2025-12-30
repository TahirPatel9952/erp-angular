import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { ProductionTracking, ProductionTrackingRequest, ProductionTrackingUpdate, InProcessInventory } from '../models/production-tracking.model';

@Injectable({
  providedIn: 'root',
})
export class ProductionTrackingService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/production/tracking`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<ProductionTracking>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<ProductionTracking>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<ProductionTracking>> {
    return this.http.get<ApiResponse<ProductionTracking>>(`${this.apiUrl}/${id}`);
  }

  getByWorkOrder(workOrderId: number): Observable<ApiResponse<ProductionTracking[]>> {
    return this.http.get<ApiResponse<ProductionTracking[]>>(`${this.apiUrl}/work-order/${workOrderId}`);
  }

  getActive(): Observable<ApiResponse<ProductionTracking[]>> {
    return this.http.get<ApiResponse<ProductionTracking[]>>(`${this.apiUrl}/active`);
  }

  getByOperator(operatorId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<ProductionTracking>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<ProductionTracking>>>(`${this.apiUrl}/operator/${operatorId}`, { params });
  }

  create(request: ProductionTrackingRequest): Observable<ApiResponse<ProductionTracking>> {
    return this.http.post<ApiResponse<ProductionTracking>>(this.apiUrl, request);
  }

  update(id: number, request: ProductionTrackingUpdate): Observable<ApiResponse<ProductionTracking>> {
    return this.http.patch<ApiResponse<ProductionTracking>>(`${this.apiUrl}/${id}`, request);
  }

  start(id: number): Observable<ApiResponse<ProductionTracking>> {
    return this.http.patch<ApiResponse<ProductionTracking>>(`${this.apiUrl}/${id}/start`, {});
  }

  pause(id: number): Observable<ApiResponse<ProductionTracking>> {
    return this.http.patch<ApiResponse<ProductionTracking>>(`${this.apiUrl}/${id}/pause`, {});
  }

  resume(id: number): Observable<ApiResponse<ProductionTracking>> {
    return this.http.patch<ApiResponse<ProductionTracking>>(`${this.apiUrl}/${id}/resume`, {});
  }

  complete(id: number, completedQuantity: number, rejectedQuantity?: number): Observable<ApiResponse<ProductionTracking>> {
    return this.http.patch<ApiResponse<ProductionTracking>>(`${this.apiUrl}/${id}/complete`, { completedQuantity, rejectedQuantity });
  }

  // In-process inventory
  getInProcessInventory(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<InProcessInventory>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<InProcessInventory>>>(`${this.apiUrl}/in-process`, { params });
  }

  getInProcessByWorkOrder(workOrderId: number): Observable<ApiResponse<InProcessInventory>> {
    return this.http.get<ApiResponse<InProcessInventory>>(`${this.apiUrl}/in-process/work-order/${workOrderId}`);
  }
}

