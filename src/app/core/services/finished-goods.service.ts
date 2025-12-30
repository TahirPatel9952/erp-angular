import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { FinishedGoods, FinishedGoodsRequest } from '../models/finished-goods.model';

@Injectable({
  providedIn: 'root',
})
export class FinishedGoodsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/inventory/finished-goods`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<FinishedGoods>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<FinishedGoods>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<FinishedGoods>> {
    return this.http.get<ApiResponse<FinishedGoods>>(`${this.apiUrl}/${id}`);
  }

  getByCode(code: string): Observable<ApiResponse<FinishedGoods>> {
    return this.http.get<ApiResponse<FinishedGoods>>(`${this.apiUrl}/code/${code}`);
  }

  getByBarcode(barcode: string): Observable<ApiResponse<FinishedGoods>> {
    return this.http.get<ApiResponse<FinishedGoods>>(`${this.apiUrl}/barcode/${barcode}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<FinishedGoods>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<FinishedGoods>>>(`${this.apiUrl}/search`, { params });
  }

  getByCategory(categoryId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<FinishedGoods>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<FinishedGoods>>>(`${this.apiUrl}/category/${categoryId}`, { params });
  }

  getAllActive(): Observable<ApiResponse<FinishedGoods[]>> {
    return this.http.get<ApiResponse<FinishedGoods[]>>(`${this.apiUrl}/active`);
  }

  getLowStockItems(): Observable<ApiResponse<FinishedGoods[]>> {
    return this.http.get<ApiResponse<FinishedGoods[]>>(`${this.apiUrl}/low-stock`);
  }

  create(request: FinishedGoodsRequest): Observable<ApiResponse<FinishedGoods>> {
    return this.http.post<ApiResponse<FinishedGoods>>(this.apiUrl, request);
  }

  update(id: number, request: FinishedGoodsRequest): Observable<ApiResponse<FinishedGoods>> {
    return this.http.put<ApiResponse<FinishedGoods>>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  activate(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}

