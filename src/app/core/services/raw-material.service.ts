import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { RawMaterial, RawMaterialRequest } from '../models/raw-material.model';

@Injectable({
  providedIn: 'root',
})
export class RawMaterialService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/inventory/raw-materials`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<RawMaterial>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<RawMaterial>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<RawMaterial>> {
    return this.http.get<ApiResponse<RawMaterial>>(`${this.apiUrl}/${id}`);
  }

  getByCode(code: string): Observable<ApiResponse<RawMaterial>> {
    return this.http.get<ApiResponse<RawMaterial>>(`${this.apiUrl}/code/${code}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<RawMaterial>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<RawMaterial>>>(`${this.apiUrl}/search`, { params });
  }

  getByCategory(categoryId: number, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<RawMaterial>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<RawMaterial>>>(`${this.apiUrl}/category/${categoryId}`, { params });
  }

  getAllActive(): Observable<ApiResponse<RawMaterial[]>> {
    return this.http.get<ApiResponse<RawMaterial[]>>(`${this.apiUrl}/active`);
  }

  getLowStockItems(): Observable<ApiResponse<RawMaterial[]>> {
    return this.http.get<ApiResponse<RawMaterial[]>>(`${this.apiUrl}/low-stock`);
  }

  create(request: RawMaterialRequest): Observable<ApiResponse<RawMaterial>> {
    return this.http.post<ApiResponse<RawMaterial>>(this.apiUrl, request);
  }

  update(id: number, request: RawMaterialRequest): Observable<ApiResponse<RawMaterial>> {
    return this.http.put<ApiResponse<RawMaterial>>(`${this.apiUrl}/${id}`, request);
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

