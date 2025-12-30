import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { Unit, UnitRequest, UnitType } from '../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/units`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<Unit>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<Unit>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Unit>> {
    return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/${id}`);
  }

  getBySymbol(symbol: string): Observable<ApiResponse<Unit>> {
    return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/symbol/${symbol}`);
  }

  getByType(type: UnitType): Observable<ApiResponse<Unit[]>> {
    return this.http.get<ApiResponse<Unit[]>>(`${this.apiUrl}/type/${type}`);
  }

  getAllActive(): Observable<ApiResponse<Unit[]>> {
    return this.http.get<ApiResponse<Unit[]>>(`${this.apiUrl}/active`);
  }

  getBaseUnits(): Observable<ApiResponse<Unit[]>> {
    return this.http.get<ApiResponse<Unit[]>>(`${this.apiUrl}/base`);
  }

  create(request: UnitRequest): Observable<ApiResponse<Unit>> {
    return this.http.post<ApiResponse<Unit>>(this.apiUrl, request);
  }

  update(id: number, request: UnitRequest): Observable<ApiResponse<Unit>> {
    return this.http.put<ApiResponse<Unit>>(`${this.apiUrl}/${id}`, request);
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

