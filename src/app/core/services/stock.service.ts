import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { Stock, StockAdjustment, StockAdjustmentRequest, StockTransfer, StockTransferRequest } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/inventory/stock`;

  // Stock queries
  getStock(itemType: string, itemId: number, warehouseId?: number): Observable<ApiResponse<Stock[]>> {
    let params = new HttpParams()
      .set('itemType', itemType)
      .set('itemId', itemId.toString());
    if (warehouseId) {
      params = params.set('warehouseId', warehouseId.toString());
    }
    return this.http.get<ApiResponse<Stock[]>>(this.apiUrl, { params });
  }

  getStockByWarehouse(warehouseId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Stock>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<Stock>>>(`${this.apiUrl}/warehouse/${warehouseId}`, { params });
  }

  getLowStock(): Observable<ApiResponse<Stock[]>> {
    return this.http.get<ApiResponse<Stock[]>>(`${this.apiUrl}/low-stock`);
  }

  getOutOfStock(): Observable<ApiResponse<Stock[]>> {
    return this.http.get<ApiResponse<Stock[]>>(`${this.apiUrl}/out-of-stock`);
  }

  // Stock adjustments
  getAdjustments(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<StockAdjustment>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<StockAdjustment>>>(`${this.apiUrl}/adjustments`, { params });
  }

  getAdjustmentById(id: number): Observable<ApiResponse<StockAdjustment>> {
    return this.http.get<ApiResponse<StockAdjustment>>(`${this.apiUrl}/adjustments/${id}`);
  }

  searchAdjustments(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<StockAdjustment>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<StockAdjustment>>>(`${this.apiUrl}/adjustments/search`, { params });
  }

  getPendingAdjustments(): Observable<ApiResponse<StockAdjustment[]>> {
    return this.http.get<ApiResponse<StockAdjustment[]>>(`${this.apiUrl}/adjustments/pending`);
  }

  createAdjustment(request: StockAdjustmentRequest): Observable<ApiResponse<StockAdjustment>> {
    return this.http.post<ApiResponse<StockAdjustment>>(`${this.apiUrl}/adjustments`, request);
  }

  approveAdjustment(id: number): Observable<ApiResponse<StockAdjustment>> {
    return this.http.patch<ApiResponse<StockAdjustment>>(`${this.apiUrl}/adjustments/${id}/approve`, {});
  }

  rejectAdjustment(id: number, reason: string): Observable<ApiResponse<StockAdjustment>> {
    return this.http.patch<ApiResponse<StockAdjustment>>(`${this.apiUrl}/adjustments/${id}/reject`, { reason });
  }

  // Stock transfers
  getTransfers(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<StockTransfer>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<StockTransfer>>>(`${this.apiUrl}/transfers`, { params });
  }

  getTransferById(id: number): Observable<ApiResponse<StockTransfer>> {
    return this.http.get<ApiResponse<StockTransfer>>(`${this.apiUrl}/transfers/${id}`);
  }

  createTransfer(request: StockTransferRequest): Observable<ApiResponse<StockTransfer>> {
    return this.http.post<ApiResponse<StockTransfer>>(`${this.apiUrl}/transfers`, request);
  }

  completeTransfer(id: number): Observable<ApiResponse<StockTransfer>> {
    return this.http.patch<ApiResponse<StockTransfer>>(`${this.apiUrl}/transfers/${id}/complete`, {});
  }

  cancelTransfer(id: number, reason?: string): Observable<ApiResponse<StockTransfer>> {
    return this.http.patch<ApiResponse<StockTransfer>>(`${this.apiUrl}/transfers/${id}/cancel`, { reason });
  }
}

