import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { FinishedGoodsStock } from '../models/finished-goods-stock.model';

@Injectable({
  providedIn: 'root',
})
export class FinishedGoodsStockService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/inventory/finished-goods-stock`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<FinishedGoodsStock>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<FinishedGoodsStock>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<FinishedGoodsStock>> {
    return this.http.get<ApiResponse<FinishedGoodsStock>>(`${this.apiUrl}/${id}`);
  }

  getAllWithStock(): Observable<ApiResponse<FinishedGoodsStock[]>> {
    return this.http.get<ApiResponse<FinishedGoodsStock[]>>(`${this.apiUrl}/with-stock`);
  }

  getByFinishedGoodsId(finishedGoodsId: number): Observable<ApiResponse<FinishedGoodsStock[]>> {
    return this.http.get<ApiResponse<FinishedGoodsStock[]>>(`${this.apiUrl}/finished-goods/${finishedGoodsId}`);
  }

  getByWarehouseId(warehouseId: number): Observable<ApiResponse<FinishedGoodsStock[]>> {
    return this.http.get<ApiResponse<FinishedGoodsStock[]>>(`${this.apiUrl}/warehouse/${warehouseId}`);
  }

  getTotalStockByFinishedGoodsId(finishedGoodsId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/finished-goods/${finishedGoodsId}/total`);
  }
}
