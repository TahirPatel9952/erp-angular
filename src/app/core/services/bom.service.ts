import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { BOM, BOMRequest } from '../models/bom.model';

@Injectable({
  providedIn: 'root',
})
export class BOMService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/production/bom`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<BOM>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<BOM>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<BOM>> {
    return this.http.get<ApiResponse<BOM>>(`${this.apiUrl}/${id}`);
  }

  getByCode(code: string): Observable<ApiResponse<BOM>> {
    return this.http.get<ApiResponse<BOM>>(`${this.apiUrl}/code/${code}`);
  }

  getByFinishedGoods(finishedGoodsId: number): Observable<ApiResponse<BOM[]>> {
    return this.http.get<ApiResponse<BOM[]>>(`${this.apiUrl}/finished-goods/${finishedGoodsId}`);
  }

  getActiveByFinishedGoods(finishedGoodsId: number): Observable<ApiResponse<BOM>> {
    return this.http.get<ApiResponse<BOM>>(`${this.apiUrl}/finished-goods/${finishedGoodsId}/active`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<BOM>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<BOM>>>(`${this.apiUrl}/search`, { params });
  }

  getAllActive(): Observable<ApiResponse<BOM[]>> {
    return this.http.get<ApiResponse<BOM[]>>(`${this.apiUrl}/active`);
  }

  create(request: BOMRequest): Observable<ApiResponse<BOM>> {
    return this.http.post<ApiResponse<BOM>>(this.apiUrl, request);
  }

  update(id: number, request: BOMRequest): Observable<ApiResponse<BOM>> {
    return this.http.put<ApiResponse<BOM>>(`${this.apiUrl}/${id}`, request);
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

  duplicate(id: number, newVersion: string): Observable<ApiResponse<BOM>> {
    const params = new HttpParams().set('newVersion', newVersion);
    return this.http.post<ApiResponse<BOM>>(`${this.apiUrl}/${id}/duplicate`, {}, { params });
  }
}

