import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PageResponse, PageRequest } from '../models/api-response.model';
import { UserDetails, UserRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/users`;

  getAll(pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<UserDetails>>> {
    let params = new HttpParams();
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
      if (pageRequest.sort) params = params.set('sortBy', pageRequest.sort);
      if (pageRequest.direction) params = params.set('sortDir', pageRequest.direction);
    }
    return this.http.get<ApiResponse<PageResponse<UserDetails>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<UserDetails>> {
    return this.http.get<ApiResponse<UserDetails>>(`${this.apiUrl}/${id}`);
  }

  getByUsername(username: string): Observable<ApiResponse<UserDetails>> {
    return this.http.get<ApiResponse<UserDetails>>(`${this.apiUrl}/username/${username}`);
  }

  search(query: string, pageRequest?: PageRequest): Observable<ApiResponse<PageResponse<UserDetails>>> {
    let params = new HttpParams().set('q', query);
    if (pageRequest) {
      if (pageRequest.page !== undefined) params = params.set('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params = params.set('size', pageRequest.size.toString());
    }
    return this.http.get<ApiResponse<PageResponse<UserDetails>>>(`${this.apiUrl}/search`, { params });
  }

  getAllActive(): Observable<ApiResponse<UserDetails[]>> {
    return this.http.get<ApiResponse<UserDetails[]>>(`${this.apiUrl}/active`);
  }

  getByRole(roleId: number): Observable<ApiResponse<UserDetails[]>> {
    return this.http.get<ApiResponse<UserDetails[]>>(`${this.apiUrl}/role/${roleId}`);
  }

  create(request: UserRequest, password: string): Observable<ApiResponse<UserDetails>> {
    return this.http.post<ApiResponse<UserDetails>>(this.apiUrl, request, {
      params: { password },
    });
  }

  update(id: number, request: UserRequest): Observable<ApiResponse<UserDetails>> {
    return this.http.put<ApiResponse<UserDetails>>(`${this.apiUrl}/${id}`, request);
  }

  changePassword(id: number, request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/change-password`, request);
  }

  resetPassword(id: number, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/reset-password`, { newPassword });
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

  getRoles(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/v1/roles`);
  }
}

